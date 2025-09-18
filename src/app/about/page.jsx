import React from "react";

const teamMembers = [
  {
    name: "Muhamad Abdul Azis",
    role: "Backend Developer",
    image: "/team/azis.jpg", // taruh di /public/team/azis.jpg
  },
  {
    name: "Ryan Gabriel",
    role: "Frontend Developer",
    image: "/team/ryan.jpg",
  },
  {
    name: "Rafif",
    role: "UI/UX Designer",
    image: "/team/rafif.jpg",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900 flex flex-col items-center py-16 px-6">
      {/* Logo / Title */}
      <div className="flex flex-col items-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center shadow-lg mb-4">
          <span className="text-white font-bold text-xl">C</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900">About Us</h1>
        <p className="text-gray-600 mt-2 max-w-xl text-center">
          Kami adalah tim pengembang di balik <span className="font-semibold text-yellow-600">Cultunesia</span>, 
          berfokus untuk menghadirkan pengalaman interaktif yang elegan dan informatif.
        </p>
      </div>

      {/* Team Members */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-5xl w-full">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 flex flex-col items-center border border-yellow-100"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-28 h-28 object-cover rounded-full border-4 border-yellow-500 shadow-md"
            />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              {member.name}
            </h2>
            <p className="text-yellow-600 font-medium">{member.role}</p>
          </div>
        ))}
      </div>

      {/* Footer text */}
      <div className="mt-16 text-center text-gray-600 max-w-lg">
        <p>
          Dengan dedikasi dan semangat kolaborasi, tim kami terus berusaha
          menghadirkan inovasi terbaik untuk pengembangan platform ini.
        </p>
      </div>
    </div>
  );
}
