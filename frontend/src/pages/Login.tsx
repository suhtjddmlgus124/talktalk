import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api, { type AxiosError } from "@/api/api";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


const loginSchema = z.object({
    username: z.string().trim().min(1, '필수 항목입니다.'),
    password: z.string().min(1, '필수 항목입니다.'),
});
type LoginSchema = z.infer<typeof loginSchema>;
type LoginResponse = { detail: string };
type LoginError = { detail?: string, non_field_errors?: string[], username: string[], password: string[] };

export default function Login() {
    const form = useForm({ mode: 'onBlur', resolver: zodResolver(loginSchema), defaultValues: {
        username: "",
        password: "",
    }});
    const mutation = useMutation<LoginResponse, AxiosError<LoginError>, LoginSchema>({
        mutationKey: ['account', 'login'],
        mutationFn: async (data) => {
            const response = await api.post('/api/account/login/', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ['account', 'profile'] })
            toast.success('로그인에 성공했습니다.');
            navigate('/');
        },
        onError: (error) => {
            if(error.response) {
                const data = error.response.data;
                for(const [ key, value ] of Object.entries(data)) {
                    if(key === 'detail') form.setError('root', { message: value as string });
                    else if(key === 'non_field_errors') form.setError('root', { message: (value as string[])[0] });
                    else {
                        form.setError(key as keyof LoginSchema, { message: (value as string[])[0] });
                    }
                }
            }
            else {
                form.setError('root', { message: '알 수 없는 오류가 발생했습니다.' });
            }
        },
    });
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return (
        <div className="absolute flex inset-0 justify-center items-center">
            <Card className="w-120">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">로그인</CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="login-form" onSubmit={form.handleSubmit((data)=>mutation.mutate(data))}>
                        <FieldGroup>
                            <Controller name="username" control={form.control} render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="username">아이디</FieldLabel>
                                    <Input {...field} id="username" aria-invalid={fieldState.invalid} autoComplete="off" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}/>
                            <Controller name="password" control={form.control} render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="password">비밀번호</FieldLabel>
                                    <Input {...field} id="password" type="password" aria-invalid={fieldState.invalid} autoComplete="off" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}/>
                            {form.formState.errors.root && <FieldError errors={[form.formState.errors.root]} />}
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button className="w-full" type="submit" form="login-form">로그인</Button>
                    <Button className="w-full" variant="link" asChild>
                        <Link to="/register">회원가입</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}