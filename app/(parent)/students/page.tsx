import { getCurrentUser } from "@/lib/session";
import { getStudentsByParentId } from "@/lib/students";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";

type Props = {};

const StudentsPage = async (props: Props) => {
  const user = await getCurrentUser();
  if (!user) {
    return notFound();
  }

  const students = await getStudentsByParentId({ parentId: user.id });
  if (students.length === 0) {
    return notFound();
  } else {
    redirect(`/students/${students[0].id}`);
  }
};

export default StudentsPage;
