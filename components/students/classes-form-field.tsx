// TODO: 動作確認

import { StudentEditSchemaType } from "@/lib/validations/student";
import React from "react";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<StudentEditSchemaType>;
};

const ClassesFormField = ({ form }: Props) => {
  return <div>ClassesFormField</div>;

  // const { fields: classes } = useFieldArray({
  //   control: form.control,
  //   name: "classes",
  // });

  // const [classOptionsByGrade, setClassOptionsByGrade] = useState<{}[]>();

  // const schoolId = form.watch("schoolId");

  // useEffect(() => {
  //   console.log("hogehoge-");
  // }, [schoolId]);

  // return (
  //   <>
  //     {classes.map((class_) => (
  //       <div key={class_.id}></div>
  //     ))}
  //   </>
  // );
};

export default ClassesFormField;
