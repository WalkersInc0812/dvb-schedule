import DownloadAttendances from "./_components/download-attendances";

type Props = {};

const AdminToolPage = async (props: Props) => {
  return (
    <div>
      <DownloadAttendances />
    </div>
  );
};

export default AdminToolPage;
