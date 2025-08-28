// icons and material-tailwind
import { FaFilePdf } from "react-icons/fa6";
import { FaRegFilePdf } from "react-icons/fa";

const manuals = [
  {
    lang: "Bahasa Indonesia",
    description: "Lihat panduan pengguna lengkap dalam Bahasa Indonesia.",
    buttonText: "Buka User Manual",
    pdfUrl: "../../../manuals/user-manual-id.pdf",
  },
  {
    lang: "English",
    description: "View the complete user manual in English.",
    buttonText: "Open User Manual",
    pdfUrl: "../../../manuals/user-manual-en.pdf",
  },
];

const UserManualComponent = () => {
  return (
    <section className="py-16 px-8" id="manual">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
            User Manual
          </h2>
          <p className="mt-3 text-sm text-gray-600">
            See the guide for borrowing items through the user manual
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {manuals.map((manual, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl border-2 border-gray-300 p-8 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className="p-4 bg-indigo-100 rounded-full mb-4">
                  <FaRegFilePdf className="text-4xl text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-indigo-800 mb-2">{manual.lang}</h3>
                <p className="text-gray-600 mb-6 flex-grow text-sm">{manual.description}</p>

                <a
                  href={manual.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg text-sm bg-indigo-600 px-6 py-3 text-white font-semibold shadow-md transition-all duration-300 group-hover:bg-indigo-700 group-hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <FaFilePdf />
                  {manual.buttonText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserManualComponent;
