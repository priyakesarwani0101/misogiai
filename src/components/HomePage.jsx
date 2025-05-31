import React from "react";

const HomePage = () => {
  return (
    <div className="bg-gray-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Host Events That Truly Connect
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Real-time RSVPs, live feedback, and attendance tracking all in one
            platform
          </p>
        </div>
      </section>
      {/* <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div> */}
    </div>
  );
};

export default HomePage;
