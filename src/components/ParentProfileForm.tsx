import React from "react";
import InputField from "./InputField";

interface ParentProps {
    parentData: { bio: string };
    setParentData: (data: any) => void;
}

const ParentProfileForm: React.FC<ParentProps> = ({ parentData, setParentData }) => {
    return <InputField label="Bio" type="text" name="bio" value={parentData.bio} onChange={(e) => setParentData({ ...parentData, bio: e.target.value })} textarea />;
};

export default ParentProfileForm;
