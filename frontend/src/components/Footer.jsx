const Footer = () => {
    return (
      <footer className="bg-gray-100 text-white py-8 bottom-0 w-full shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-5">
          <div className="mb-6 md:mb-0">
            <h1 className="text-xl font-bold text-black">LinkedIn Clone</h1>
          </div>
  
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <a href="#" className="text-gray-950 hover:text-white">About</a>
            <a href="#" className="text-gray-950 hover:text-white">Help Center</a>
            <a href="#" className="text-gray-950 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-gray-950 hover:text-white">Terms</a>
            <a href="#" className="text-gray-950 hover:text-white">Careers</a>
          </div>
  
          <div className="text-gray-400 mt-4 md:mt-0">
            &copy; 2024 LinkedIn Clone. All Rights Reserved.
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  