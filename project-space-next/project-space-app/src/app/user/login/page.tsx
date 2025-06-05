export default function Login() {
    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <form className="w-full max-w-md">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    Login
                </button>
            </form>
        </div>
    );
}