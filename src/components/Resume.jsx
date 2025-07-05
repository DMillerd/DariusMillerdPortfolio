//imports
import DariusMillerdResume from "../assets/Darius-Millerd-Resume.pdf"
import DariusMillerdResumepng from "../assets/Darius-Millerd-Resume.png"

//main function
const Resume = () => {



    return (
        <div>
            <div className="header-container">
            <h1>My Resume</h1>
            <hr className="gradient-2"></hr>
            </div>
            {/* link downloadable copy of resume, also make resume info displayed on this page in a clear and concise manner. */}
            <div>
                <img className="resume-photo" src={DariusMillerdResumepng} alt="My resume" />
                <h3>Download PDF</h3>
                <embed src={DariusMillerdResume} width="500px" height="300px" />
            </div>
        </div>
    );
};

export default Resume;