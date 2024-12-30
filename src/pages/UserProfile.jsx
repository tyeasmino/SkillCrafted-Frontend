import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext"; 
import SkillSeekerProfile from "../components/skillSeeker/SkillSeekerProfile";
import SkillCrafterProfile from "../components/skillCrafter/SkillCrafterProfile";


const UserProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <section>
      {(user && user.ck) ? (
        <>
          <SkillCrafterProfile />
        </>
      ) : (<> </>)}

      {(user && user.sk) ? (
        <>
            <SkillSeekerProfile />
        </>
      ) : (<></>)}
    </section>
  );
};

export default UserProfile;
