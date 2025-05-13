import React from 'react';
import "../styles/about.css";
import Header from './Header';
// import personPlaceholder from '../assets/TeamMemberPhotos/person-placeholder.jpg'
import namrataPhoto from '../assets/TeamMemberPhotos/namrata.jpg'
import dariusPhoto from '../assets/TeamMemberPhotos/darius.jpg'
import miguelPhoto from '../assets/TeamMemberPhotos/miguel.jpg'

// import additional photos of team members
const About = () => {
  return (
    <>
    <Header/>
    <div className="about-page-container">
      
      <div className="our-story">
        <h2>Welcome to Meal Genie!</h2>
        <p>
          We know the feeling of wanting a nutritious meal after a long day but lacking the energy to figure it out. That's why we built Meal Genie - to be your go-to resource for stress-free meal planning.
        </p>

        <p>
        By understanding your unique dietary needs, allergies, protein requirements, available prep time, and more, Meal Genie acts like your personal culinary genie, offering personalized meal suggestions. Let us handle the planning, so you can enjoy the delicious results.
        </p>
      </div>

      <TeamSection />
    </div>
    </>
  );
}

const TeamSection = () => {
  const teamMembers = [
    { name: "Namrata Shah", bio: "Full Stack Software Engineer", photo: namrataPhoto, profile: "https://www.linkedin.com/in/namratash/" },  
    { name: "Miguel Serrano", bio: "Full Stack Software Engineer", photo: miguelPhoto, profile: "https://www.linkedin.com/in/em-serrano/" }, 
    { name: "Darius Millerd", bio: "Full Stack Software Engineer", photo: dariusPhoto, profile: "https://www.linkedin.com/in/dariusmillerd/"}, 
    // update photo to the correct imported photo
  ];

  return (
    <div className="team-section">
      <h2>Meet the Team</h2>
      <div className="team-members-grid">
        {teamMembers.map((member, index) => (
          <TeamMemberCard key={index} member={member} />
        ))}
      </div>
    </div>
  );
};

const TeamMemberCard = ({ member }) => {
  return (
    <div className="team-member-card">
      <h3>{member.name}</h3>
      <a href={member.profile}><img className="team-member-photo" src={member.photo} alt="Photo of team member" /></a> {/*Images shown in about page*/}
      <p className="team-member-bio">{member.bio}</p>
    </div>
  );
};

export default About;