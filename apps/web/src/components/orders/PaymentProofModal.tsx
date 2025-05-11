import { X } from 'lucide-react';

interface PaymentProofModalProps {
  showModal: boolean;
  proofImage: string;
  onClose: () => void;
}

const PaymentProofModal: React.FC<PaymentProofModalProps> = ({
  showModal,
  proofImage,
  onClose,
}) => {
  if (!showModal || !proofImage) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-5 text-gray-600 hover:text-gray-900 text-xl font-bold"
        >
          <X className="bg-gray-200 rounded-full px-1 py-1" />
        </button>
        <img
          src={proofImage}
          alt="Payment Proof"
          className="w-full h-auto rounded-lg object-contain"
        />
      </div>
    </div>
  );
};

export default PaymentProofModal;
