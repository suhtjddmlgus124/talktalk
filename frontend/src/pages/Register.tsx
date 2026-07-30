import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import api, { type AxiosError } from "@/api/api";
import { Link, useNavigate } from "react-router-dom";
import { CenterContainer } from "@/components/ui/container";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


const registerSchema = z.object({
    username: z.string().trim().min(1, '필수 항목입니다.'),
    password: z.string().min(1, '필수 항목입니다.'),
    passwordConfirm: z.string().min(1, '필수 항목입니다.'),
    nickname: z.string().trim().min(1, '필수 항목입니다.'),
})
.refine((data) => data.password === data.passwordConfirm, { path: ['passwordConfirm'], message: '비밀번호가 일치하지 않습니다.' });

type RegisterSchema = z.infer<typeof registerSchema>;
type RegisterResponse = { detail: string };
type RegisterError = { detail?: string, non_field_errors?: string[], username?: string[], password?: string[], nickname?: string[] };

export default function Register() {
    const form = useForm<RegisterSchema>({ mode: 'onBlur', resolver: zodResolver(registerSchema), defaultValues: {
        username: "",
        password: "",
        passwordConfirm: "",
        nickname: "",
    }});
    const mutation = useMutation<RegisterResponse, AxiosError<RegisterError>, RegisterSchema>({
        mutationKey: ['account', 'register'],
        mutationFn: async (data) => {
            const fetchData = {...data, passwordConfirm: undefined};
            const response = await api.post('/api/account/register/', fetchData);
            return response.data;
        },
        onSuccess: () => {
            toast.success('회원가입에 성공했습니다. 다시 로그인해 주세요.');
            navigate('/login');
        },
        onError: (error) => {
            if(error.response) {
                const data = error.response.data;
                for(const [ key, value ] of Object.entries(data)) {
                    if(key === 'detail') form.setError('root', { message: value as string });
                    else if(key === 'non_field_errors') form.setError('root', { message: (value as string[])[0] });
                    else {
                        form.setError(key as keyof RegisterSchema, { message: (value as string[])[0] });
                    }
                }
            }
            else {
                form.setError('root', { message: '알 수 없는 오류가 발생했습니다.' });
            }
        },
    });
    const navigate = useNavigate();

    return (
        <CenterContainer>
            <Card className="w-120">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">회원가입</CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="register-form" onSubmit={form.handleSubmit((data)=>mutation.mutate(data))}>
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
                            <Controller name="passwordConfirm" control={form.control} render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="passwordConfirm">비밀번호 확인</FieldLabel>
                                    <Input {...field} id="passwordConfirm" type="password" aria-invalid={fieldState.invalid} autoComplete="off" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}/>
                            <Controller name="nickname" control={form.control} render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="nickname">닉네임</FieldLabel>
                                    <Input {...field} id="nickname" aria-invalid={fieldState.invalid} autoComplete="off" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}/>
                        </FieldGroup>
                        {form.formState.errors.root && <FieldError errors={[form.formState.errors.root]}/>}
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button className="w-full" type="submit" form="register-form">회원가입</Button>
                    <Button className="w-full" variant="link" asChild>
                        <Link to="/login">로그인</Link>
                    </Button>
                </CardFooter>
            </Card>
        </CenterContainer>
    );
}