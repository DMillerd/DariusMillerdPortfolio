//imports

//main function
const Resume = () => {



    return (
        <div>
            <div className="header-container">
            <h1>This is my Resume</h1>
            <hr className="gradient-2"></hr>
            </div>
            {/* link downloadable copy of resume, also make resume info displayed on this page in a clear and concise manner. */}
            <div>
                <h2>Education</h2>
                <li>Austin Community College
                    Software Development Bootcamp, Computer Software
                    Engineering, October 2024 - May 2025
                    Learned how to fully develop and deploy Javascript/HTML/CSS
                    applications, while using backend technologies such as MongoDB
                    and SQL, while learning other forms of support/extensions to our
                    knowledge such as React.JS, Git, Github, Visual Studio Code and many
                    more.</li>
                <li> Austin Community College
                    Associate of Science - AS, Engineering, - December 2023
                    Focus on Engineering processes and Tech, such as full-stack
                    development, computer aided design, and electrical engineering.</li>
            </div>
            <div>
                <p>Full resume to be added for download at a later date.</p>
            </div>
        </div>
    );
};

export default Resume;