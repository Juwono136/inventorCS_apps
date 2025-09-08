import { FaRegCommentDots } from "react-icons/fa";

const FeedbackComponent = () => {
  const linkForm = "https://forms.office.com/r/y0tGpTHFBW?origin=lprLink";

  return (
    <section id="feedback" className="py-16 bg-gray-50">
      <div className="container mx-auto max-w-4xl text-center px-6 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-700 to-purple-800 bg-clip-text text-transparent animate-gradient">
          Feedback and Report Issues
        </h2>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto">
          Please send feedback or report issues related to the InventorCS website for better
          improvements.
        </p>
        <div className="mt-8">
          <a
            href={linkForm}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-sm items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white font-semibold shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <FaRegCommentDots className="text-lg" />
            Give Feedback Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeedbackComponent;
