import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loadUser, updateProfile, userLogout } from "../../api/authApi";
import { getMyAllSubmitedQuiz } from "../../api/submissionApi";

const UserProfile = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [myQuizSubmission, setMyQuizSubmission] = useState([]);
  const [formModified, setFormModified] = useState(false);
  const [formValues, setFormValues] = useState({
    name: currentUser?.user?.name,
    phone: currentUser?.user?.phone,
    email: currentUser?.user?.email || "",
  });



  const handleLogout = () => {
    userLogout().then((data) => {
      if (data?.success) {
        alert(data?.message);
        navigate("/");

        loadUser()
          .then((data) => {
            if (data?.success) {
              setCurrentUser({ user: data?.user, isAuthenticated: true });
            } else {
              setCurrentUser({ isAuthenticated: false });
            }
          })
          .catch((error) => console.log(error));
      }
    });
  };
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleFieldChange = (fieldName, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));

    // Set the form modification state after a delay (e.g., 300 milliseconds)
    debounce(() => {
      setFormModified(true);
    }, 300)();
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateProfile(formValues.name, formValues.phone, formValues.email)
      .then((res) => {
        alert(res.message);
        loadUser().then((data) => {
          if (data?.success) {
            setCurrentUser({ user: data?.user, isAuthenticated: true });
          } else {
            setCurrentUser({ isAuthenticated: false });
          }
          setFormModified(false);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancel = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Reset the form values and modification state
    setFormValues({
      name: currentUser?.user?.name,
      phone: currentUser?.user?.phone,
      email: currentUser?.user?.email || "",
    });
    setFormModified(false);
  };

  useEffect(() => {
    const unsub = async () => {
      try {
        const data = await getMyAllSubmitedQuiz();
        console.log(data[0], "done");

        setMyQuizSubmission(data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    unsub();
  }, []);

  return (
    <>
      <div className="lg:px-36 pt-24 px-6 ">
        <h2 className="text-3xl font-semibold mb-5 text-gray-700">
          User Profile
        </h2>
      </div>
      <div className="grid grid-row-1 lg:grid-row-2 gap-4 sm:p-6 sm:m-6 p-2 m-4">
        <form className="flex flex-col md:flex lg:flex-row items-start justify-center border-2 p-6">

          <div>
            <input
              type="text"
              placeholder="Name"
              onChange={(e) => handleFieldChange("name", e.target.value)}
              value={formValues.name}
              className="w-full p-3 input input-bordered shadow-md mb-2 text-black "
            />

            <input
              type="tel"
              maxlength="10"
              required
              placeholder="Phone No"
              name="phone"
              className="w-full p-3 input input-bordered shadow-md mb-2 text-black"
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              value={formValues.phone}
              autoComplete="off"
            />

            <input
              type="email"
              placeholder="Email"
              name="email"
              className="w-full p-3 input input-bordered shadow-md mb-2 text-black"
              onChange={(e) => handleFieldChange("email", e.target.value)}
              value={formValues.email}
            />
          </div>

          {formModified && (
            <div className="flex justify-center items-center w-full mt-2 gap-4">
              <button
                onClick={handleCancel}
                className="border-1 border-black  text-black font-bold py-2 px-4 border  rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
              >
                Update
              </button>
            </div>
          )}
        </form>

        <div className="text-black h-[50vh] border-2 md:p-6 px-2 py-3 overflow-y-scroll">
          <h4 className="text-sm uppercase text-center scroll-m-3 mb-3 ">
            Submissions
          </h4>

          {Array.isArray(myQuizSubmission) && myQuizSubmission.length !== 0 ? (
            myQuizSubmission.map((quiz) => (
              <div className="border-2 flex text-sm justify-between items-center px-4 py-3 gap-x-3 text-gray-700" key={quiz.quizId}>
                <span className="w-1/2">{quiz.quizTitle}</span>
                <div className="flex justify-center items-center gap-4">
                  <p>{quiz.timestamp?.slice(0, -14)}</p>
                  <h2>
                    {quiz.points}/{quiz.answers?.length}
                  </h2>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center">
              <p>No quiz submissions found.</p>
            </div>

          )}
        </div>
      </div>
      <div className="px-6 m-6 text-gray-400 flex items-center justify-center">
        <button onClick={handleLogout} className="bg-black p-2 font-serif ">
          Logout
        </button>
      </div>
    </>
  );
};

export default UserProfile;
