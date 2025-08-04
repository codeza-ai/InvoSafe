import ProfileCard from "@/components/Profile";

export default function Home() {
    return (
        <div className="flex w-full items-baseline justify-center min-h-screen">
            <div className="w-2/3 py-6">
                <ProfileCard />
            </div>
        </div>
    );
}