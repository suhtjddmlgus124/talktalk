export function Container({ children }: { children?: React.ReactNode }) {
    return (
        <div className="max-h-full overflow-y-auto">
            { children }
        </div>
    );
}

export function CenterContainer({ children }: { children?: React.ReactNode }) {
    return (
        <div className="absolute flex inset-0 justify-center items-center">
            { children }
        </div>
    );
}