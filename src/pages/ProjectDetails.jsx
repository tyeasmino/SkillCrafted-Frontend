import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';  // Import useNavigate
import axios from 'axios';
import { TbEyeCheck } from "react-icons/tb";
import { FaWhatsappSquare } from "react-icons/fa";
import { ImLinkedin } from "react-icons/im";
import { FaGithubSquare } from "react-icons/fa";
import BaseButton from '../components/BaseButton';
import { AuthContext } from '../contexts/AuthContext';
import { SiSkillshare } from "react-icons/si";
import { FaCircleUser } from "react-icons/fa6";



const ProjectDetails = () => {
  const { user } = useContext(AuthContext);  // Get the current logged-in user
  const { id } = useParams();  // Get the project ID from URL params
  const navigate = useNavigate();  // Use navigate hook to programmatically navigate
  const [project, setProject] = useState(null);
  const [categories, setCategories] = useState([]); // For storing categories
  const [company, setCompany] = useState(null); // For storing company details
  const [isProposalSubmitted, setIsProposalSubmitted] = useState(false); // Track if the proposal is submitted
  const [proposals, setProposals] = useState([]);
  const [selectedProposalId, setSelectedProposalId] = useState(null);
  const [isProposalUpdated, setIsProposalUpdated] = useState(false);


  const STAR_CHOICES = [
    { value: '★☆☆☆☆', label: '★☆☆☆☆' },
    { value: '★★☆☆☆', label: '★★☆☆☆' },
    { value: '★★★☆☆', label: '★★★☆☆' },
    { value: '★★★★☆', label: '★★★★☆' },
    { value: '★★★★★', label: '★★★★★' },
  ];



  const [formData, setFormData] = useState({
    category: '',
    title: '',
    budget: '',
    deadline: '',
    requirements: '',
    description: '',
    anyAttachment: '',
    skillSeeker: '', // Skill Seeker ID to fetch company details
  });

  const [proposal, setProposal] = useState({
    proposal: "",
    is_proposal_accepted: false,
    is_completed: false,
    project: "",
    proposed_by: ""
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://skillcrafted-backend.vercel.app/projects/categoryList/');
        setCategories(response.data); // Set categories from API
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch project details based on the id from URL params
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`https://skillcrafted-backend.vercel.app/projects/projectList/${id}/`);
        setProject(response.data);
        setFormData({
          category: response.data.category,
          title: response.data.title,
          budget: response.data.budget,
          deadline: response.data.deadline,
          requirements: response.data.requirements,
          description: response.data.description,
          anyAttachment: response.data.anyAttachment,
          skillSeeker: response.data.skillSeeker, // Store skillSeeker ID here
        });
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    const fetchProposals = async () => {
      try {
        const response = await axios.get(`https://skillcrafted-backend.vercel.app/skillCrafter/filtered-project-proposals/?project=${id}`);
        setProposals(response.data); // Store the list of proposals
      } catch (error) {
        console.error('Error fetching proposals:', error);
      }
    };

    if (id) {
      fetchProposals(); // Fetch proposals if there's a project id
    }

    fetchProjectDetails();
  }, [id]);


  const [selectedProposal, setSelectedProposal] = useState(null);

  const handleProposalSelection = (e, proposal) => {
    setSelectedProposal({
      ...proposal,
      is_proposal_accepted: e.target.checked, // Update acceptance status
    });
  };

  const handleProposalSubmission = async (e) => {
    e.preventDefault();

    // Check if a proposal is selected and all required fields are filled
    if (!selectedProposal || !selectedProposal.is_proposal_accepted) {
      alert("Please select a proposal to accept.");
      return;
    }

    // Prepare the data to be sent to the backend
    const updatedProposalData = {
      id: selectedProposal.id,
      proposal: selectedProposal.proposal,
      project: selectedProposal.project,
      proposed_by: selectedProposal.proposed_by,
      is_proposal_accepted: selectedProposal.is_proposal_accepted,
    };

    try {
      // Send PUT request to update the proposal status
      const response = await axios.put(
        `https://skillcrafted-backend.vercel.app/skillCrafter/project-proposal/${selectedProposal.id}/`,
        updatedProposalData
      );

      if (response.status === 200) {
        alert("Proposal status updated successfully!");
      }
    } catch (error) {
      console.error("Error updating proposal status:", error);
      alert("There was an error updating the proposal status.");
    }
  };


  const [specializations, setSpecializations] = useState([]);


  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await axios.get("https://skillcrafted-backend.vercel.app/skillSeeker/specialization/");
        setSpecializations(res.data);
        console.log('specializations: ', res.data);
      } catch (error) {
        console.error("Error fetching specializations:", error);
      }
    };
    fetchSpecializations();
  }, []);





  // Fetch company details based on the skillSeeker ID
  useEffect(() => {
    if (formData.skillSeeker) {
      const fetchCompanyDetails = async () => {
        try {
          const response = await axios.get(`https://skillcrafted-backend.vercel.app/skillSeeker/skill-seekers/${formData.skillSeeker}/`);
          setCompany(response.data); // Set company details from API
        } catch (error) {
          console.error('Error fetching company details:', error);
        }
      };

      fetchCompanyDetails();
    }
  }, [formData.skillSeeker]);

  // Handle proposal submission (redirect if not logged in)
  const handleSubmitProposal = (e) => {
    e.preventDefault();

    // Ensure proposal field is not empty
    if (!proposal.proposal) {
      alert("Please provide a proposal description.");
      return;
    }

    // Ensure user is logged in
    if (!user) {  // If user is not logged in
      localStorage.setItem(`proposal_${id}`, proposal.proposal); // Save proposal to localStorage
      navigate('/login'); // Redirect to login page
      return;
    } else if (!user.ck) {
      alert('You must be a Skill Crafter to submit a proposal!');
      return;
    }

    // Prepare the proposal data to be submitted
    const proposalData = {
      proposal: proposal.proposal,       // The proposal text
      is_proposal_accepted: false,        // Initial status of proposal
      is_completed: '2',                  // Set this to '2' (Not Started) based on your PROGRESS_CHOICES
      project: id,                        // The project ID from the URL
      proposed_by: user.ck,               // The user ID (Skill Crafter)
    };

    console.log("Proposal Data:", proposalData); // Log to check before submission

    // Make the POST request to submit the proposal
    axios.post('https://skillcrafted-backend.vercel.app/skillCrafter/project-proposal/', proposalData)
      .then((response) => {
        console.log('Proposal submitted successfully:', response.data);
        localStorage.removeItem(`proposal_${id}`); // Clear proposal data after submission
        setIsProposalSubmitted(true);
        alert('Your proposal has been submitted!');
      })
      .catch((error) => {
        console.error('Error submitting proposal:', error);
        alert('There was an error submitting your proposal.');
      });
  };




  // Define state for skillCrafterDetails
  const [skillCrafterDetails, setSkillCrafterDetails] = useState({});

  // Fetch SkillCrafter Details based on proposal.proposed_by
  const fetchSkillCrafterDetails = async (userCK) => {
    console.log('userck: ', userCK);

    try {
      const response = await axios.get(`https://skillcrafted-backend.vercel.app/skillCrafter/skill-crafter/${userCK}/`);
      setSkillCrafterDetails(response.data); // Store SkillCrafter details
      console.log('ck details: ', response.data);
      console.log('id: ', response.data.user);
    } catch (error) {
      console.error('Error fetching SkillCrafter details:', error);
    }
  };

  useEffect(() => {
    // For each proposal, fetch the SkillCrafter details
    proposals.forEach((proposal) => {
      fetchSkillCrafterDetails(proposal.proposed_by);
    });
  }, [proposals]);


  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (proposalId) => {
    const proposalDetails = proposals.find((proposal) => proposal.id === proposalId);
    fetchSkillCrafterDetails(proposalDetails.proposed_by); // Fetch SkillCrafter details on demand
    setIsModalOpen(true); // Open modal
  };

  let specializationIds = skillCrafterDetails.specialization || []; // Ensure it's an array

  // Now you can map over specializationIds to get the specialization names
  const specializationNames = specializationIds.map(id => {
    const specialization = specializations.find(spec => spec.id === id); // Find specialization by ID
    return specialization ? specialization.name : null; // Return the name if found, else null
  }).filter(name => name !== null); // Filter out any null values (in case some specialization was not found)

  console.log(specializationNames); // This will give you an array of specialization names


  const [userDetails, setUserDetails] = useState({});

  // Function to fetch the user details (first name and last name) by user ID
  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`https://skillcrafted-backend.vercel.app/accounts/users/${userId}/`);
      setUserDetails(response.data); // Store user details (first name, last name)
      console.log('User details fetched: ', response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    // Fetch user details based on the 'proposed_by' field in each proposal
    proposals.forEach((proposal) => {
      const userId = proposal.proposed_by.user; // Get user ID from proposal
      console.log('sc id: ', userId);
      if (userId) {
        fetchUserDetails(userId); // Fetch the user details for the SkillCrafter
      }
    });
  }, [proposals]); // Run when the proposals array is updated


  const handleReviewSubmit = async (projectId, rating, body, skillCrafterId) => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'https://skillcrafted-backend.vercel.app/skillCrafter/project-review/',
        {
          completed_project: projectId, // Project ID
          reviewer: user.sk,  // The skill seeker ID
          skillCrafter: skillCrafterId,  // The skill crafter being reviewed
          rating: rating,  // Rating value
          body: body,  // Review text
        },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (response.status === 201) {
        alert('Review submitted successfully!');
        // Update review status and data
        setReviewSubmitted(true);
        setSubmittedReview({
          rating: response.data.rating,
          body: response.data.body,
        });
      } else {
        alert('Failed to submit review!');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review!');
    }
  };







  useEffect(() => {
    // Check if there's saved proposal data for the current project id in localStorage
    const savedProposal = localStorage.getItem(`proposal_${id}`);
    if (savedProposal) {
      setProposal({ ...proposal, proposal: savedProposal });
    }

    // Check if the user already submitted a proposal
    const checkProposalStatus = async () => {
      try {
        const response = await axios.get(`https://skillcrafted-backend.vercel.app/skillCrafter/filtered-project-proposals/?project=${id}&proposed_by=${user.ck}`);
        if (response.data && response.data.length > 0) {
          // If there's an existing proposal, mark it as submitted
          setIsProposalSubmitted(true);
          setProposal({ ...proposal, proposal: response.data[0].proposal });
        }
      } catch (error) {
        console.error('Error fetching proposal status:', error);
      }
    };

    if (user && user.ck) {
      checkProposalStatus(); // Check if the user has already submitted a proposal
    }
  }, [id, user]);








  const [reviewSubmitted, setReviewSubmitted] = useState(false); // Track if the review is submitted
  const [submittedReview, setSubmittedReview] = useState({ rating: null, body: '' }); // Store the submitted review data

  useEffect(() => {
    // Check if the user has already submitted a review for this project
    const checkReviewStatus = async () => {
      try {
        const response = await axios.get(`https://skillcrafted-backend.vercel.app/skillCrafter/project-review/`, {
          params: {
            completed_project: proposal.id,  // Use the project ID
            reviewer: user.sk, // The skill seeker ID (user.sk)
          },
        });

        if (response.data && response.data.length > 0) {
          setReviewSubmitted(true); // Review exists
          setSubmittedReview({
            rating: response.data[0].rating,
            body: response.data[0].body,
          }); // Set the review data
        } else {
          setReviewSubmitted(false); // No review submitted
        }
      } catch (error) {
        console.error('Error checking review status:', error);
      }
    };

    if (user && proposal.id) {
      checkReviewStatus(); // Make the check when the user is logged in and project is available
    }
  }, [user, proposal.id]); // Re-run when user or project changes




  // Check if the project deadline has passed
  const isDeadlinePassed = new Date(formData.deadline) < new Date();

  if (!project || !categories.length || !company) {
    return <p>Loading...</p>;
  }

  return (
    <section className="container flex flex-col md:flex-row gap-10 mx-auto p-6">
      {/* Project Details Section */}
      <div className="bg-white p-6 rounded-md w-full md:w-3/5 md:max-h-[800px] shadow-lg">
        <h3 className="text-2xl mb-4">Project Details</h3>

        {/* Category */}
        <div>
          <h6 className="mt-1 w-full text-[#626677] font-semibold text-sm">
            {categories.find(category => category.id === formData.category)?.name || 'Category not available'}
          </h6>
        </div>

        {/* Title */}
        <div className="mb-4">
          <h6 className="w-full font-bold text-[20px]">{formData.title}</h6>
        </div>

        {/* Requirements */}
        <div className="mb-4">
          <p className="block text-sm font-medium text-[#626677]">Requirements</p>
          <h3 className="w-full">{formData.requirements}</h3>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="block text-sm font-medium text-[#626677]">Description</p>
          <h3 className="w-full">{formData.description}</h3>
        </div>

        {/* Budget and Deadline */}
        <div>
          <div className="mb-4">
            <p className="block text-sm font-medium text-[#626677]">
              Budget: <span className="text-black">{formData.budget} Taka</span>
            </p>
          </div>
          <div className="mb-4">
            <p className="block text-sm font-medium text-[#626677]">
              Deadline:
              <span className={new Date(formData.deadline) < new Date() ? 'text-red-500' : 'text-black'}> {formData.deadline} </span>


            </p>
          </div>
        </div>

        {/* Attachment */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 flex items-center justify-between">Attachment</label>
          {formData.anyAttachment && !(formData.anyAttachment instanceof File) && (
            <img
              src={formData.anyAttachment}
              alt="Attachment Preview"
              className="w-full max-h-[300px] mt-2 rounded-xl"
            />
          )}
        </div>
      </div>

      <div className="w-full md:w-2/5 rounded-md flex flex-col gap-8 p-5 shadow-md">
        {/* Conditionally Render Company Details Section */}
        {!user || (user && !user.sk) ? (
          <div>
            {/* Company Details */}
            <div className='mx-2 p-5 shadow-[#425BF5] rounded-md shadow'>
              <h3 className="text-2xl mb-4">{company.company_name} Details</h3>
              {/* Company Logo */}
              <div className="mb-4">
                <img
                  src={company.company_logo}
                  alt="Company Logo"
                  className="w-48 rounded-full mx-auto"
                />
              </div>

              {/* Company Details */}
              <div className="mb-4">
                <p className="block text-sm font-medium text-[#626677]">Year Started: {company.company_started} </p>
              </div>
              <div className="mb-4">
                <p className="block text-sm font-medium text-[#626677]">Address: {company.company_address} </p>
              </div>

              <div className='flex justify-between'>
                {/* Company Website */}
                <div className="mb-4">
                  <p className="block text-sm font-medium text-[#626677]">Website:
                    <Link to={company.company_website} className="text-[#425BF5] ml-2" target="_blank" rel="noopener noreferrer">
                      {company.company_website}
                    </Link>
                  </p>
                </div>

                {/* Social Links */}
                <div className="mb-4">
                  <ul className='flex gap-2'>
                    <li><Link to={company.whatsapp} className="text-[24px]"><FaWhatsappSquare /></Link></li>
                    <li><Link to={company.linkedin} className="text-[24px]"><ImLinkedin /></Link></li>
                    <li><Link to={company.github} className="text-[24px]"><FaGithubSquare /></Link></li>
                  </ul>
                </div>
              </div>
            </div>




            {isDeadlinePassed ? (
              <div className="text-red-500 text-lg font-semibold my-2">***No longer accepting proposals</div>
            ) : (<>

              {/* Conditionally Render Proposal Form or Submitted Message */}
              {!isProposalSubmitted ? (
                <div className="rounded-md flex flex-col gap-8 my-5">
                  <div className='mx-2 p-5 shadow-[#f58442] rounded-md shadow'>
                    <h3 className="text-2xl mb-4">Submit Your Proposal</h3>

                    {/* Proposal Form */}
                    <form onSubmit={handleSubmitProposal}>
                      <div className="mb-4">
                        <label htmlFor="proposal" className="block text-sm font-medium text-[#626677]">Proposal Description</label>
                        <textarea
                          id="proposal"
                          name="proposal"
                          className="w-full p-2 mt-2 border rounded-md"
                          rows="4"
                          value={proposal.proposal}
                          onChange={(e) => setProposal({ ...proposal, proposal: e.target.value })}
                          required
                        ></textarea>
                      </div>

                      <button type="submit"
                        className="text-white bg-[#425BF5] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Submit Proposal
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="rounded-md flex flex-col gap-8 my-5">
                  {/* Submitted Proposal Message */}
                  <div className="mx-2 p-5 shadow-[#f58442] rounded-md shadow">
                    <h3 className="text-2xl mb-4 text-center font-semibold ">You have already submitted a proposal</h3>
                    <p className='shadow min-h-[100px] rounded-md p-2 shadow-[#425BF5]'>{proposal.proposal}</p>
                    {/* <p className='mt-2'> Your Proposal Status is: Pending  </p> */}
                  </div>
                </div>
              )}

            </>)}


          </div>
        ) :
          <>
            {user && user.sk ? (
              <div>
                <h3 className="text-2xl mb-4">All Proposals for this Project</h3>



                {/* Modal for SkillCrafter details */}
                {isModalOpen && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-lg w-8/12  relative">
                      <button onClick={() => setIsModalOpen(false)} className="absolute bg-black text-white px-5 py-2 rounded-md top-2 right-2 text-sm">
                        Close
                      </button>
                      <h3 className="text-xl font-semibold mb-4">Details</h3>

                      <div className='flex gap-10'>
                        {/* SkillCrafter Profile Info */}
                        <div className="w-full md:w-1/3">
                          <div className="mb-4 flex gap-4 items-start">
                            {skillCrafterDetails.image && !(skillCrafterDetails.image instanceof File) && (
                              <img src={skillCrafterDetails.image} alt="Attachment Preview" className="max-w-[60px] max-h-[60px] mt-2 rounded-xl" />
                            )}

                            {
                              skillCrafterDetails.specialization && skillCrafterDetails.specialization.length > 0 ? (
                                // Loop over the specialization array to get specialization names
                                skillCrafterDetails.specialization
                                  .map(id => {
                                    // Find specialization by ID
                                    const specialization = specializations.find(spec => spec.id === id);
                                    return specialization ? specialization.name : null; // Return the name or null if not found
                                  })
                                  .filter(name => name !== null) // Remove null values if any specialization is not found
                                  .join(', ') || 'Specialization not available' // Join the names as a comma-separated string
                              ) : (
                                'Loading specializations...'
                              )
                            }
                          </div>

                          <h6 className="font-bold text-[20px] mb-5">Educational Profile</h6>
                          <div className="relative z-0 w-full mb-5 group">
                            <input className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              disabled
                              value={skillCrafterDetails.last_educational_qualification}
                            />
                            <label
                              htmlFor="last_educational_qualification"
                              className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Last Educational Qualification
                            </label>
                          </div>
                          <div className="relative z-0 w-full mb-5 group">
                            <input disabled
                              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              value={skillCrafterDetails.last_educational_institution}
                            />
                            <label htmlFor="last_educational_institution"
                              className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Last Educational Institue
                            </label>
                          </div>
                          <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                              <input disabled
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                value={skillCrafterDetails.last_passing_year}
                              />
                              <label
                                htmlFor="last_passing_year"
                                className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                              >
                                Passing Year
                              </label>
                            </div>

                            <div className="relative z-0 w-full mb-5 group">
                              <input
                                type="text"
                                name="last_result"
                                id="last_result"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={skillCrafterDetails.last_result}
                              />
                              <label
                                htmlFor="last_result"
                                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                              >
                                Result
                              </label>
                            </div>
                          </div>


                        </div>

                        <div className="w-full md:w-1/3">
                          <h6 className="font-bold text-[20px] mb-5">Working Profile</h6>
                          <div className="relative z-0 w-full mb-5 group">
                            <input
                              type="text"
                              name="last_working_company"
                              id="last_working_company"
                              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              value={skillCrafterDetails.last_working_company}
                            />
                            <label
                              htmlFor="last_working_company"
                              className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Last Working Company
                            </label>
                          </div>
                          <div className="relative z-0 w-full mb-5 group">
                            <input
                              type="text"
                              name="last_working_years"
                              id="last_working_years"
                              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              value={skillCrafterDetails.last_working_years}
                            />
                            <label
                              htmlFor="last_working_years"
                              className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Last Working Years with short details
                            </label>
                          </div>

                          <div className="relative z-0 w-full mb-5 group">
                            <input
                              type="text"
                              name="last_working_projects_link_1"
                              id="last_working_projects_link_1"
                              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              value={skillCrafterDetails.last_working_projects_link_1}
                            />
                            <label
                              htmlFor="last_working_projects_link_1"
                              className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Last Working Project Link-1
                            </label>
                          </div>

                          <div className="relative z-0 w-full mb-5 group">
                            <input
                              type="text"
                              name="last_working_projects_link_2"
                              id="last_working_projects_link_2"
                              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              value={skillCrafterDetails.last_working_projects_link_2}
                            />
                            <label
                              htmlFor="last_working_projects_link_2"
                              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Last Working Project Link-2
                            </label>
                          </div>

                          <div className="mb-4">

                            {skillCrafterDetails.curriculum_vitae && !(skillCrafterDetails.curriculum_vitae instanceof File) && (
                              <Link download to={skillCrafterDetails.curriculum_vitae} target='blank' className='flex items-center rounded-lg py-2.5 px-5 w-fit my-2 text-sm text-[#F4F5F7] bg-[#141A34]  appearance-none  focus:outline-none focus:ring-0 focus:border-[#F4F5F7] peer gap-2 ' > <TbEyeCheck /> CV </Link>
                            )}

                          </div>
                        </div>

                        <div className="w-full md:w-1/3">
                          <h6 className="font-bold text-[20px] mb-5">
                            Contact Details
                          </h6>
                          <div class="relative z-0 w-full mb-5 group">
                            <input
                              type="text"
                              name="whatsapp"
                              id="whatsapp"
                              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              value={skillCrafterDetails.whatsapp}
                            />
                            <label
                              for="whatsapp"
                              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Whatsapp
                            </label>
                          </div>
                          <div class="relative z-0 w-full mb-5 group">
                            <input
                              type="text"
                              name="linkedin"
                              id="linkedin"
                              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              value={skillCrafterDetails.linkedin}
                            />
                            <label
                              for="linkedin"
                              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Linkedin
                            </label>
                          </div>
                          <div class="relative z-0 w-full mb-5 group">
                            <input
                              type="text"
                              name="github"
                              id="github"
                              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              value={skillCrafterDetails.github}
                            />
                            <label
                              for="github"
                              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Github
                            </label>
                          </div>
                          <div class="relative z-0 w-full mb-5 group">
                            <input
                              type="text"
                              name="portfolio"
                              id="portfolio"
                              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              value={skillCrafterDetails.portfolio}
                            />
                            <label
                              for="portfolio"
                              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Portfolio
                            </label>
                          </div>
                        </div>
                      </div>



                    </div>
                  </div>
                )}




                {/* Check if any proposal is accepted */}
                {proposals.some((proposal) => proposal.is_proposal_accepted) ? (
                  <div>
                    {/* Display the Accepted Proposal */}
                    <div>
                      <h4 className="text-xl font-semibold">Accepted Proposals</h4>
                      {proposals
                        .filter((proposal) => proposal.is_proposal_accepted) // Only accepted proposal
                        .map((proposal, index) => {
                          const user = userDetails; // Get user details from state
                          return (
                            <div key={index} className="bg-white p-4 shadow rounded-md my-2">
                              <div className="mb-5 flex items-start justify-between gap-2">
                                <div className="flex items-start">
                                  <div>
                                    {/* SkillCrafter Image */}
                                    {skillCrafterDetails?.image ? (
                                      <img
                                        src={skillCrafterDetails.image}
                                        alt="Proposer Image"
                                        className="w-12 h-12 rounded-full mr-4"
                                      />
                                    ) : (
                                      <FaCircleUser className="w-12 h-12 rounded-full mr-4" />
                                    )}
                                  </div>

                                  <div className="flex flex-col gap-0">
                                    <h3 className="text-xl">{user.first_name} {user.last_name}</h3> {/* Display full name */}
                                    <div className="text-sm font-semibold">
                                      {skillCrafterDetails.specialization && skillCrafterDetails.specialization.length > 0 ? (
                                        skillCrafterDetails.specialization
                                          .map((id) => {
                                            // Find specialization by ID
                                            const specialization = specializations.find((spec) => spec.id === id);
                                            return specialization ? specialization.name : null;
                                          })
                                          .filter((name) => name !== null)
                                          .join(', ') || 'Specialization not available'
                                      ) : (
                                        'Loading specializations...'
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-5 items-center">
                                  <Link className="text-[40px]" to={skillCrafterDetails.portfolio} target="blank">
                                    <SiSkillshare />
                                  </Link>
                                  <Link className="text-[20px]" to={skillCrafterDetails.github} target="blank">
                                    <FaGithubSquare />
                                  </Link>
                                </div>
                              </div>
                              <p>{proposal.proposal}</p>


                              <div>
                                {proposal.is_completed !== '2' ? (
                                  <>
                                    <p className="text-sm text-gray-700">
                                      <strong>Completed? </strong>
                                      {proposal.is_completed === '1' ? 'YES' : 'Status is Pending'}
                                    </p>

                                    {/* If proposal is completed and no review has been submitted */}
                                    {proposal.is_completed === '1' && !reviewSubmitted && (
                                      <div className="text-sm text-gray-700">
                                        <form
                                          className="mt-3 bg-white p-5 rounded-lg shadow-lg"
                                          onSubmit={(e) => {
                                            e.preventDefault();
                                            const formData = new FormData(e.target);
                                            const rating = formData.get('rating');
                                            const body = formData.get('body');
                                            handleReviewSubmit(project.id, rating, body, proposal.proposed_by);
                                          }}
                                        >
                                          <h3 className="text-xl font-semibold mb-3 text-gray-800">Give Ratings</h3>
                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Ratings</label>
                                            <select
                                              name="rating"
                                              required
                                              className="border border-gray-300 rounded-md p-2 mt-1 w-full"
                                            >
                                              <option value="">Select Rating</option>
                                              {STAR_CHOICES.map((choice, index) => (
                                                <option key={index} value={choice.value}>
                                                  {choice.label}
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Review</label>
                                            <textarea
                                              name="body"
                                              rows="3"
                                              placeholder="Write your review here..."
                                              required
                                              className="border border-gray-300 rounded-md p-2 mt-1 w-full"
                                            ></textarea>
                                          </div>
                                          <button
                                            type="submit"
                                            className="bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 w-full mt-3 transition-colors"
                                          >
                                            Submit
                                          </button>
                                          <small className="text-xs text-gray-500 mt-2 block text-center">
                                            Give a rating to your skill crafter
                                          </small>
                                        </form>
                                      </div>
                                    )}

                                    {/* If a review is already submitted */}
                                    {reviewSubmitted && (
                                      <div className="mt-5 p-4 bg-gray-100 rounded-md shadow-md">
                                        <h4 className="text-lg font-semibold">Your Review</h4>
                                        <div className="text-sm text-gray-700">
                                          <p><strong>Rating:</strong> {submittedReview.rating} Stars</p>
                                          <p><strong>Review:</strong> {submittedReview.body}</p>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <strong>Completed? </strong>
                                    {proposal.is_completed === '1' ? 'YES' : 'Status is Pending'}
                                  </>
                                )}
                              </div>


                              <div className="flex justify-between text-[20px] my-3">
                                <span className="bg-green-500 text-white text-xs font-bold py-1 px-3 rounded-full">
                                  Accepted
                                </span>


                                <button
                                  className="text-blue-500"
                                  onClick={() => handleViewDetails(proposal.id)} // Open modal
                                >
                                  <TbEyeCheck />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>


                    {/* Display Unaccepted Proposals */}
                    <div>
                      <h4 className="text-xl font-semibold mt-6">Unaccepted Proposals</h4>
                      {proposals
                        .filter((proposal) => !proposal.is_proposal_accepted) // Only unaccepted proposals
                        .map((proposal, index) => {
                          // const proposerName = users.find((user) => user.id === proposal.proposed_by)?.name || 'Unknown User';
                          return (
                            <div key={index} className="bg-white p-4 shadow rounded-md my-2">
                              <div className="mb-5 flex items-start justify-between gap-2">
                                <div className='flex items-start'>
                                  <div>
                                    {/* SkillCrafter Image */}
                                    {skillCrafterDetails?.image ?
                                      <>
                                        <img
                                          src={skillCrafterDetails.image}
                                          alt="Proposer Image"
                                          className="w-12 h-12 rounded-full mr-4"
                                        />
                                      </> : <>
                                        <FaCircleUser className="w-12 h-12 rounded-full mr-4" />
                                      </>}
                                  </div>

                                  <div className='flex flex-col gap-0'>
                                    <div className='text-sm font-semibold'>
                                      {
                                        skillCrafterDetails.specialization && skillCrafterDetails.specialization.length > 0 ? (
                                          // Loop over the specialization array to get specialization names
                                          skillCrafterDetails.specialization
                                            .map(id => {
                                              // Find specialization by ID
                                              const specialization = specializations.find(spec => spec.id === id);
                                              return specialization ? specialization.name : null; // Return the name or null if not found
                                            })
                                            .filter(name => name !== null) // Remove null values if any specialization is not found
                                            .join(', ') || 'Specialization not available' // Join the names as a comma-separated string
                                        ) : (
                                          'Loading specializations...'
                                        )
                                      }
                                    </div>

                                  </div>

                                </div>
                                <div className='flex gap-5 items-center  '>
                                  <Link className='text-[40px] ' to={skillCrafterDetails.portfolio} target='blank' ><SiSkillshare /></Link>
                                  <Link className='text-[20px] ' to={skillCrafterDetails.github} target='blank' ><FaGithubSquare /></Link>
                                </div>
                              </div>
                              <p>{proposal.proposal}</p>

                              <div className='flex justify-between text-[20px]'>

                                <span className="bg-red-400 text-white text-xs font-bold py-1 px-3 rounded-full">
                                  Rejected
                                </span>


                                <button
                                  className="text-blue-500"
                                  onClick={() => handleViewDetails(proposal.id)} // Open modal
                                >
                                  <TbEyeCheck />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* If no proposal is accepted, show the form to accept one */}
                    {proposals.length === 0 ? (
                      <p>No proposals available.</p>
                    ) : (
                      <form onSubmit={handleProposalSubmission}>
                        {proposals
                          .filter((proposal) => !proposal.is_proposal_accepted) // Only show unaccepted proposals
                          .map((proposal, index) => (
                            <div key={index} className="bg-white p-4 shadow rounded-md my-2">
                              <h4 className="text-xl font-bold">Proposal by {proposal.proposed_by}</h4>
                              <p>{proposal.proposal}</p>
                              <p>Status: {proposal.is_proposal_accepted ? "Accepted" : "Pending"}</p>
                              <div className="flex justify-between">
                                <span className="font-semibold">Do you like this proposal?</span>
                                <div>
                                  {/* Radio button to accept the proposal */}
                                  <input
                                    type="radio"
                                    required
                                    name="is_accepted"
                                    value={proposal.id}
                                    checked={selectedProposal?.id === proposal.id && selectedProposal.is_proposal_accepted}
                                    onChange={(e) => handleProposalSelection(e, proposal)} // Set selected proposal and acceptance status
                                  />{" "}
                                  Yes
                                </div>
                              </div>
                            </div>
                          ))}
                        <button
                          type="submit"
                          className="text-[#e8e8e8] bg-[#425BF5] w-fit text-center px-5 py-2 rounded-md"
                        >
                          Update Status
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>

            ) : (
              <div>You are not a Skill Seeker</div>
            )}
          </>
        }
      </div>
    </section>
  );
};

export default ProjectDetails;
