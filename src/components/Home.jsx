//imports
import DariusAndToby from "../assets/DariusAndToby.png"

//main function
const Home = () => {


return (
        <div>
            <div className="header-container">
            <h1>Darius Millerd</h1>
            <hr className="gradient-2"></hr>
            </div>
            <p>Aspiring Full-Stack Software Engineer</p>
            <img className="home-photo" src={DariusAndToby} alt="Photo of Darius" />
            {/* take new photo, maybe make a gallery. */}
        </div>
    );
};

export default Home;