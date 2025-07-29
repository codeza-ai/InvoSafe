'use server';

interface Subsriber{
    email: string;
}
export default function subcribeEmail(data : Subsriber){
    // Connect with database

    console.log("Subscribing email:", data.email);
    // Here you would typically send the data to your backend API
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate a successful subscription
            resolve({ success: true, message: "Subscription successful!" });
        }, 1000);
    }
);
}