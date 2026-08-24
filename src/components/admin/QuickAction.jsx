import React from 'react';
import { Plus } from 'lucide-react';

/**
 * QuickAction – a styled CTA button for admin actions.
 * Props:
 * - label: button text
 * - onClick: click handler
 */
const QuickAction = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-2xl transition-colors"
  >
    <Plus size={16} />
    {label}
  </button>
);

export default QuickAction;
