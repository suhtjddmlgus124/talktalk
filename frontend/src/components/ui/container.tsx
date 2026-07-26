export function Container({ children }: { children?: React.ReactNode }) {
    return (
        <div className="max-h-full p-6 overflow-y-auto">
            { children }
        </div>
    );
}