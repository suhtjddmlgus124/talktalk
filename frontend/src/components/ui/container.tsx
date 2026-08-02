import { cn } from "@/lib/utils";


export function Container({ className, children, ...props }: React.ComponentProps<'div'>) {
    return (
        <div className={cn("max-h-full overflow-y-auto", className)} {...props}>
            { children }
        </div>
    );
}

export function CenterContainer({ className, children, ...props }: React.ComponentProps<'div'>) {
    return (
        <div className={cn("absolute flex inset-0 justify-center items-center", className)} {...props}>
            { children }
        </div>
    );
}