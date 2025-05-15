//imports
import DariusAndToby from "../assets/DariusAndToby.png"

//main function
const Home = () => {



return (
        <div>
            <h1>Darius Millerd's Portfolio</h1>
            <p>Aspiring Full-Stack Software Engineer</p>
            <img className="home-photo" src={DariusAndToby} alt="Photo of Darius" />
        </div>
    );

};

export default Home;