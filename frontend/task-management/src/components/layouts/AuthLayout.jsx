import UI_IMG from '../../assets/images/bgr.png';

const AuthLayout = ({ children }) => {
      return (
            <div className="flex">
                  <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
                        <h2 className="text-2xl font-medium text-black">Task Manager Tool</h2>
                        {children}
                  </div>
                  <div className="hidden md:flex w-[40vw] h-screen items-center justify-center overflow-hidden p-8">
                        <img src={UI_IMG} alt="Background" className="w-64 lg:w-[90%]" />
                  </div>
            </div>
      );
};

export default AuthLayout;
