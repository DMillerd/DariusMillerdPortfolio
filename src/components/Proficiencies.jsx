//imports
import Proficiencies_card from "../components/Proficiencies_card";



//main function
const Proficiencies = () => {



    return (
        <div>
            <div className="header-container">
            <h1>Here are my Proficiencies</h1>
            <hr className="gradient-2"></hr>
            </div>
            <p>This is a list of the different coding languages I know, as well as what tools I have used in the past for previous projects.</p>
{/* make cards with icons for frontend backend and other */}
            <Proficiencies_card/>  
        </div>
    );
};

export default Proficiencies;