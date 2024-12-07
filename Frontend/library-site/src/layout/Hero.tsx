import { Typography } from "@mui/material";
import DynamicIcon from "../components/DynamicIcon";
import NavButton from "../components/NavButton";

const Hero = () => {
  return (
    <div
      className="relative h-full w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('hero.webp')` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative z-10 text-center text-white px-4">
        <Typography variant="h1" className="!mb-4">
          Welcome to
          <Typography
            variant="h1"
            component="span"
            className="!font-bold flex justify-center items-center gap-4"
          >
            {" "}
            <DynamicIcon icon="BrowseBooks" className="!w-24 !h-24 !ml-5" />
            Librarium
          </Typography>
        </Typography>
        <Typography variant="h5" className="text-lg md:text-xl !mb-6">
          Your library, your way
        </Typography>
        <div>
          <NavButton id="browseBooks" size="large" className="!mb-5" />
          <br />
          <NavButton
            id="login"
            size="large"
            className="!mr-6 !text-white"
            variant="text"
          />
          <NavButton
            variant="outlined"
            id="signup"
            size="large"
            className="!text-white !border-white"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
