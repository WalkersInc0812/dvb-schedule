import { StudentWithParntAndFacilityAndSchoolAndClasses } from "@/lib/students";
import { Facility, School } from "@prisma/client";
import React from "react";

type Props = {
  student: StudentWithParntAndFacilityAndSchoolAndClasses;
  facilities: Facility[];
  schools: School[];
  onSuccess?: () => void;
  onError?: () => void;
};

const StudentEditForm = (props: Props) => {
  return <div>StudentEditForm</div>;
};

export default StudentEditForm;
