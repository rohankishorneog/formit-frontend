import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const LandingPage = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/forms/create");
  };
  return (
    <main className="flex flex-col items-center w-screen h-screen  justify-center">
      <p className="mb-16 text-5xl">Build Forms That Work for You 🚀</p>
      <p className="w-[657px] text-center mb-8">
        Create stunning, dynamic, and user-friendly forms effortlessly. Collect
        data, engage users, and streamline your workflow with our form builder.
      </p>
      <p className="text-7xl mb-10 font-bold">FORMA</p>

      <Button className="bg-red-700" onClick={handleNavigate}>
        Start Creating
      </Button>
    </main>
  );
};

export default LandingPage;
