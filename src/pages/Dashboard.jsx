import React, { useContext, useEffect, useState } from 'react';
import noproposal from '../assets/project.jpg'
import { GiPriceTag } from 'react-icons/gi';
import { BiMessageSquareAdd } from 'react-icons/bi';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { BiMessageSquareEdit } from "react-icons/bi";
import { TbEyeCheck } from "react-icons/tb";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  // const [user, userAuthLoaading] = userAuth();

  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [categories, setCategories] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    requirements: '',
    anyAttachment: '',
    created_at: '',
    skillSeeker: '',
    category: '',
  });


  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');

      if (user.sk) {
        const fetchProjects = async () => {
          try {
            const res = await axios.get(`https://skillcrafted-backend.vercel.app/projects/projectList/?skillSeeker=${user.sk}`, {
              headers: { Authorization: `Token ${token}` },
            });
            setProjects(res.data);
          } catch (error) {
            console.error('Error fetching projects:', error);
          }
        };

        fetchProjects();
      }

      const fetchCategories = async () => {
        try {
          const categoryRes = await axios.get('https://skillcrafted-backend.vercel.app/projects/categoryList/', {
            headers: { Authorization: `Token ${token}` },
          });
          setCategories(categoryRes.data);
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };
      fetchCategories();


      if (user.ck) {
        const fetchProposals = async () => {
          try {
            const proposalRes = await axios.get(`https://skillcrafted-backend.vercel.app/skillCrafter/filtered-project-proposals/?proposed_by=${user.ck}`, {
              headers: { Authorization: `Token ${token}` },
            })
            setProposals(proposalRes.data)
            console.log(proposalRes.data);
          } catch (error) {
            console.log('Error fetching proposals: ', error)
          }
        }
        fetchProposals();
      }

    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      budget: project.budget,
      deadline: project.deadline,
      requirements: project.requirements,
      anyAttachment: project.anyAttachment,
      skillSeeker: project.skillSeeker,
      category: project.category,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleDelete = async (projectId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.delete(`https://skillcrafted-backend.vercel.app/projects/projectList/${projectId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.status === 204) {
        setProjects(projects.filter((project) => project.id !== projectId));
        alert('Project deleted successfully!');
      } else {
        alert('Failed to delete project!');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project!');
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert("You are not logged in.");
      return;
    }

    let imageUrl = formData.anyAttachment ? formData.anyAttachment : '';

    if (formData.anyAttachment && formData.anyAttachment instanceof File) {
      const imgFormData = new FormData();
      imgFormData.append('image', formData.anyAttachment);

      // Upload image to imgBB
      try {
        const imgbbResponse = await fetch('https://api.imgbb.com/1/upload?key=648e380c7b8d76ec81662ddc06d73ec5', {
          method: 'POST',
          body: imgFormData,
        });
        const imgbbData = await imgbbResponse.json();

        if (imgbbData.status === 200) {
          imageUrl = imgbbData.data.url;
        } else {
          alert('Image upload failed!');
          return;
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Image upload failed!');
        return;
      }
    }

    const projectData = {
      ...formData,
      anyAttachment: imageUrl,
    };

    console.log(imageUrl)


    try {
      const response = await axios.put(`https://skillcrafted-backend.vercel.app/projects/projectList/${selectedProject.id}/`,
        projectData,
        { headers: { Authorization: `Token ${token}` } }
      );

      if (response.status === 200) {
        alert('Project updated successfully!');
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === selectedProject.id ? { ...project, ...projectData } : project
          )
        );
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Error updating project!');
    }
  };



  const handleProposalUpdate = async (proposalId, progress) => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.patch(
        `https://skillcrafted-backend.vercel.app/skillCrafter/project-proposal/${proposalId}/`,
        { is_completed: progress },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (response.status === 200) {
        alert('Proposal status updated successfully!');

        // Update the proposals state to reflect the change and hide the form
        setProposals((prevProposals) =>
          prevProposals.map((proposal) =>
            proposal.id === proposalId ? { ...proposal, is_completed: progress } : proposal
          )
        );
      } else {
        alert('Failed to update proposal status!');
      }
    } catch (error) {
      console.error('Error updating proposal status:', error);
      alert('Error updating proposal status!');
    }
  };

  // Fetch review data when a proposal is completed and review is available
  useEffect(() => {
    // Only fetch the review for completed proposals
    proposals.forEach((proposal) => {
      if (proposal.is_completed === '1') {
        const fetchReview = async () => {
          try {
            const response = await fetch(`https://skillcrafted-backend.vercel.app/skillCrafter/project-review/`);
            const data = await response.json();

            // Find the review corresponding to the current proposal
            const projectReview = data.find((review) => review.completed_project === proposal.id);
            if (projectReview) {
              setReview((prevReviews) => [...prevReviews, projectReview]); // Store multiple reviews if needed
            }
          } catch (error) {
            console.error("Error fetching review:", error);
          }
        };

        fetchReview();
      }
    });
  }, [proposals]);  // This useEffect should depend on proposals


  const [reviews, setReviews] = useState({});

  useEffect(() => {
    proposals.forEach((proposal) => {
      if (proposal.is_completed === '1') {
        const fetchReview = async () => {
          try {
            const response = await fetch(`https://skillcrafted-backend.vercel.app/skillCrafter/project-review/`);
            const data = await response.json();
            console.log(data);

            const projectReview = data.find((review) => review.completed_project === proposal.project);
            if (projectReview) {
              setReviews((prevReviews) => ({
                ...prevReviews,
                [proposal.id]: projectReview,
              }));
            }
          } catch (error) {
            console.error("Error fetching review:", error);
          }
        };

        fetchReview();
      }
    });
  }, [proposals]);





  return (
    <div className="md:max-w-screen-xl m-auto my-10">
      {(user && user.sk) ? (
        <>
          <div>
            <h2 className="text-2xl md:text-5xl ml-10 md:ml-0 font-semibold flex gap-3 md:gap-5 items-center">
              Projects
              <Link className="text-xl md:text-3xl" to="/add-project">
                <BiMessageSquareAdd />
              </Link>
            </h2>
            <div>

              {projects.filter(project => {
                const projectDeadline = new Date(project.deadline);
                const today = new Date();
                return projectDeadline >= today;
              }).length > 0 && (
                  <div>
                    <h3 className="text-xl md:text-3xl text-center md:text-start font-semibold mt-5">Active Projects</h3>
                    <section className="flex flex-wrap justify-center md:justify-start  gap-5 my-5">
                      {projects.filter(project => {
                        const projectDeadline = new Date(project.deadline);
                        const today = new Date();
                        return projectDeadline >= today;
                      }).map((project) => {
                        const projectCategory = categories.find(
                          (category) => category.id === project.category
                        );
                        return (
                          <section key={project.id}>
                            <div className="min-w-[310px] max-w-[310px] md:min-w-[250px] md:max-w-[250px] shadow-lg rounded-md p-5">
                              <div className="top py-2">
                                <h6 className="text-[12px] text-[#626677] flex justify-between items-center">
                                  {projectCategory ? projectCategory.name : 'N/A'}
                                  <div className="flex items-center gap-1">
                                    <BiMessageSquareEdit
                                      className="text-[20px] text-green-700 cursor-pointer"
                                      onClick={() => handleEditClick(project)}
                                    />
                                    <MdOutlineDeleteSweep
                                      className="text-[20px] text-red-700 cursor-pointer"
                                      onClick={() => handleDelete(project.id)}
                                    />
                                  </div>
                                </h6>
                                <div className="h-[100px]">
                                  <h4 className="font-bold">{project.title}</h4>
                                  <h4 className=""> {project.description.length > 80 ? <>{project.description.slice(0, 25)}...</> : project.description}</h4>
                                </div>
                                <div className="flex items-center gap-3">
                                  <GiPriceTag className="text-[#425BF5]" /> {project.budget}
                                </div>
                              </div>
                              <hr />
                              <div className="btm py-2 flex items-center justify-between gap-3">
                                <div className="left">
                                  <p className="text-[12px] text-[#626677]">Due Date: {project.deadline}</p>
                                </div>
                                <div className="right">
                                  <p className="text-[20px] text-[#425BF5]">
                                    <Link to={`/project/${project.id}`} className="text-[20px] text-[#425BF5]"> <TbEyeCheck /> </Link>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </section>
                        );
                      })}
                    </section>
                  </div>
                )}


              {projects.filter(project => {
                const projectDeadline = new Date(project.deadline);
                const today = new Date();
                return projectDeadline < today;
              }).length > 0 && (
                  <div>
                    <h3 className="text-xl md:text-3xl text-center  md:text-start font-semibold mt-5">Deadline Over</h3>
                    <section className="flex flex-wrap justify-center md:justify-start gap-5 my-">
                      {projects.filter(project => {
                        const projectDeadline = new Date(project.deadline);
                        const today = new Date();
                        return projectDeadline < today;
                      }).map((project) => {
                        const projectCategory = categories.find(
                          (category) => category.id === project.category
                        );
                        return (
                          <section key={project.id}>
                            <div className="min-w-[310px] max-w-[310px] md:min-w-[250px] md:max-w-[250px] shadow-lg rounded-md p-5">
                              <div className="top py-2">
                                <h6 className="text-[12px] text-[#626677] flex justify-between items-center">
                                  {projectCategory ? projectCategory.name : 'N/A'}
                                  <div className="flex items-center gap-1">
                                    <BiMessageSquareEdit
                                      className="text-[20px] text-green-700 cursor-pointer"
                                      onClick={() => handleEditClick(project)}
                                    />
                                    <MdOutlineDeleteSweep
                                      className="text-[20px] text-red-700 cursor-pointer"
                                      onClick={() => handleDelete(project.id)}
                                    />
                                  </div>
                                </h6>
                                <div className="h-[100px]">
                                  <h4 className="font-bold">{project.title}</h4>
                                  <h4 className=""> {project.description.length > 80 ? <>{project.description.slice(0, 25)}...</> : project.description}</h4>
                                </div>
                                <div className="flex items-center gap-3">
                                  <GiPriceTag className="text-[#425BF5]" /> {project.budget}
                                </div>
                              </div>
                              <hr />
                              <div className="btm py-2 flex items-center justify-between gap-3">
                                <div className="left">
                                  <p className="text-[12px] text-[#626677]">Due Date: {project.deadline}</p>
                                </div>
                                <div className="right">
                                  <p className="text-[20px] text-[#425BF5]">
                                    <Link to={`/project/${project.id}`} className="text-[20px] text-[#425BF5]"> <TbEyeCheck /> </Link>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </section>
                        );
                      })}
                    </section>
                  </div>
                )}
            </div>
          </div >

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white  scroll-smooth     p-6 rounded-md w-[300px]   overflow-hidden   md:w-[1000px] md:max-h-[800px]">
                <h3 className="text-xl md:text-2xl mb-4">Edit Project</h3>
                <form onSubmit={handleUpdateProject}>
                  <div className="mb-2 md:mb-4">
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>Loading Categories...</option>
                      )}
                    </select>
                  </div>

                  <div className="mb-2 md:mb-4">
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className='md: flex flex-col md:flex-row md:gap-5'>
                    <div className="left w-full md:w-1/2">
                      <div className='md:flex gap-5'>
                        <div className="mb-2 md:mb-4 w-full md:w-1/2">
                          <label className="block text-sm font-medium text-gray-700">Budget</label>
                          <input
                            type="text"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="mb-2 md:mb-4 w-full md:w-1/2">
                          <label className="block text-sm font-medium text-gray-700">Deadline</label>
                          <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="mb-2 md:mb-4">
                        <label className="block text-sm font-medium text-gray-700">Requirements</label>
                        <textarea
                          rows={3}
                          name="requirements"
                          value={formData.requirements}
                          onChange={handleChange}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="mb-2 md:mb-4">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          rows={3}
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="right w-full md:w-1/2">
                      <div className="mb-2 md:mb-4">
                        <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                          Attachment
                        </label>

                        <input type="file" name="anyAttachment" onChange={handleChange} className=" file-input file-input-bordered w-full " />
                        {formData.anyAttachment && formData.anyAttachment instanceof File && (
                          <p className="text-xs text-[#425BF5] mt-1">New Image Uploaded</p>
                        )}
                        {formData.anyAttachment && !(formData.anyAttachment instanceof File) && (
                          <div>
                            <img src={formData.anyAttachment} alt="Attachment Preview" className="w-full hidden md:block max-h-[300px] mt-2 rounded-xl" />
                            <p className='text-[12px]'> Attachement Preview is disable for mobile view </p>  
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="px-4 py-2 bg-[#425BF5] text-white rounded-md mr-2">
                    Update Project
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md"
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      ) : (<></>)}




      {/* accepted jodi hoy
       tahole ami completed update korte parbo */}
      {(user && user.ck) ? (
        <>
          {proposals.length > 0 ?
            <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
              <p className="text-3xl font-semibold text-center text-[#425BF5] mb-6">
                Total Proposals: {proposals.length}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {proposals.map((proposal) => (
                  <div key={proposal.id} className="proposal-card bg-white shadow-lg rounded-lg overflow-hidden p-5">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-semibold text-lg text-gray-800">Project ID: {proposal.project}</p>

                        {proposal.is_proposal_accepted ? (
                          <span className="bg-green-600 text-white text-xs font-bold py-1 px-3 rounded-full">
                            Accepted
                          </span>
                        ) : (
                          <span className="bg-yellow-600 text-white text-xs font-bold py-1 px-3 rounded-full">
                            Pending
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600">{proposal.proposal}</p>

                      <div className="mt-auto">
                        {proposal.is_proposal_accepted && (
                          <div className="bg-white shadow-lg rounded-lg p-6 mt-4 transition-all duration-300 hover:shadow-xl hover:scale-105">
                            <div className="flex justify-between items-center">
                              <h4 className="text-lg font-semibold text-gray-800">{proposal.title}</h4>
                              {/* <p className="text-sm text-gray-500">Proposal ID: {proposal.id}</p> */}
                            </div>

                            <div className="mt-4">
                              {proposal.is_completed !== '2' ? (
                                <>
                                  <p className="text-sm text-gray-700">
                                    <strong>Completed? </strong>
                                    {proposal.is_completed === '1' ? (
                                      <span className="text-green-500 font-semibold">YES</span>
                                    ) : (
                                      <span className="text-red-500 font-semibold">NO</span>
                                    )}
                                  </p>

                                  {proposal.is_completed === '1' && reviews[proposal.id] && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                      <p><strong>Rating:</strong> <span className='text-[#425BF5] ' >{reviews[proposal.id].rating} </span></p>
                                      <p><strong>Review</strong> <br />
                                        {reviews[proposal.id].body}</p>
                                      <p className='text-[12px] text-[#626677] '>
                                        <strong>Reviewed on:</strong> {new Date(reviews[proposal.id].created).toLocaleString()}
                                      </p>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <form
                                  className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md"
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    const progress = formData.get('is_completed');
                                    handleProposalUpdate(proposal.id, progress);
                                  }}
                                >
                                  <h5 className="text-xl font-semibold text-gray-800">Update Project Completion Status</h5>
                                  <p className="text-sm text-gray-600 mt-2">
                                    Please indicate if the project is completed to update your progress.
                                  </p>
                                  <div className="flex items-center gap-4 mt-4">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                      <input
                                        name="is_completed"
                                        type="radio"
                                        value="1"
                                        className="form-radio text-[#425BF5] border-gray-300"
                                      />
                                      <span className="text-sm text-gray-700">Yes</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                      <input
                                        name="is_completed"
                                        type="radio"
                                        value="0"
                                        className="form-radio text-[#425BF5] border-gray-300"
                                      />
                                      <span className="text-sm text-gray-700">No</span>
                                    </label>
                                  </div>

                                  <button
                                    type="submit"
                                    className="mt-4 w-full bg-[#425BF5] text-white font-bold py-3 rounded-lg hover:bg-[#364f9e] transition-colors duration-300"
                                  >
                                    Submit
                                  </button>
                                  <small className="text-xs text-gray-500 mt-3 block text-center">
                                    Submit your progress to get reviewed by the project owner.
                                  </small>
                                </form>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
              </div>


            </div>

            :
            <>
              <div className=''>
                <h2 className='max-w-[700px] m-auto text-center font-bold text-xl md:text-5xl  '>No Proposal Submitted Yet</h2>
                <img className='max-w-[250px] m-auto  ' src={noproposal} alt="" />
              </div>
            </>}
        </>


      ) : (<></>)}
    </div >
  );
};

export default Dashboard;
