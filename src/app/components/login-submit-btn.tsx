import { useFormStatus } from "react-dom";

export default function LoginSubmitBtn() {
    const { pending } = useFormStatus();
    return (
        <button
        className="border-none w-full block bg-appblue-300 text-white rounded-md px-4 py-2 hover:shadow-lg cursor-pointer transition-all duration-300 hover:bg-appblue-350"
        type="submit">{
        pending ? 'Logging in...' : "Login"}
        </button>
    );
}