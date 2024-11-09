import DownloadSchedules from "./_components/download-schedules";

export const dynamic = "force-dynamic";

type Props = {};

const AdminToolPage = async (props: Props) => {
  return (
    <div>
      <DownloadSchedules />
    </div>
  );
};

export default AdminToolPage;
