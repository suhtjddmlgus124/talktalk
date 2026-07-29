export function Container({ children }: { children?: React.ReactNode }) {
    return (
        <div className="max-h-full overflow-y-auto">
            { children }
        </div>
    );
}