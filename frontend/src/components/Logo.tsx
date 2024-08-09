import logo from "../assets/logo.jpg";

type LogoProps = {
  width?: number;
  height?: number;
};

const Logo = ({ width = 150, height = 150 }: LogoProps) => {
  return (
    <div className="logo-container">
      <img
        src={logo}
        alt="Jamoveo Logo"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    </div>
  );
};

export default Logo;
