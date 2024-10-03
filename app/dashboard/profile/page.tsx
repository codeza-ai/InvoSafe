import Image from 'next/image';

export default function Page() {
  return (
    <div>
        <div className='w-full rounded-lg bg-gray-50 h-60'>
            <div className='w-40 h-40 bg-white rounded-full'>
                <Image
                    alt="Profile Picture"
                    className="rounded-full"
                    width={100}
                    height={100}
                />
            </div>
        </div>
        <div className='mt-5 w-full'>
            <h1>Top customers</h1>
            <div>

            </div>
        </div>
    </div>
  );
}