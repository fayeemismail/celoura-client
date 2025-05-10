// /components/user/Profile/PasswordSection.tsx
import PasswordField from "./PasswordField";
import COLORS from "../../../styles/theme";

type Props = {
  passwordData: any;
  setPasswordData: React.Dispatch<React.SetStateAction<any>>;
  showPasswordFields: boolean;
  setShowPasswordFields: (val: boolean) => void;
};

export default function PasswordSection({ passwordData, setPasswordData, showPasswordFields, setShowPasswordFields }: Props) {
  const update = (field: string, val: string | boolean) =>
    setPasswordData((prev: any) => ({ ...prev, [field]: val }));

  const reset = () => {
    setPasswordData({
      current: "",
      new: "",
      confirm: "",
      showCurrent: false,
      showNew: false,
      showConfirm: false,
    });
    setShowPasswordFields(false);
  };

  return !showPasswordFields ? (
    <button
      type="button"
      onClick={() => setShowPasswordFields(true)}
      className="mb-4 text-sm font-medium underline"
      style={{ color: COLORS.accent }}
    >
      Change Password?
    </button>
  ) : (
    <>
      <PasswordField
        placeholder="Current Password"
        value={passwordData.current}
        onChange={(val) => update("current", val)}
        visible={passwordData.showCurrent}
        toggle={() => update("showCurrent", !passwordData.showCurrent)}
      />
      <PasswordField
        placeholder="New Password"
        value={passwordData.new}
        onChange={(val) => update("new", val)}
        visible={passwordData.showNew}
        toggle={() => update("showNew", !passwordData.showNew)}
      />
      <PasswordField
        placeholder="Confirm New Password"
        value={passwordData.confirm}
        onChange={(val) => update("confirm", val)}
        visible={passwordData.showConfirm}
        toggle={() => update("showConfirm", !passwordData.showConfirm)}
      />
      <div className="mb-4 text-right">
        <button
          type="button"
          onClick={reset}
          className="text-sm font-medium underline"
          style={{ color: COLORS.accent }}
        >
          Cancel
        </button>
      </div>
    </>
  );
}
