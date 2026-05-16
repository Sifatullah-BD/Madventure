import React from 'react';
import SOSButton from './emergency/SOSButton';
import NotificationButton from './NotificationButton';

/**
 * VerticalFab - Unified Floating Action Button Stack
 * Consolidates emergency and informational buttons into a single vertical stack
 * to prevent overlapping with content and improve visual organization.
 */
const VerticalFab = () => {
    return (
        <div 
            className="fixed right-6 bottom-24 md:bottom-28 flex flex-col items-center gap-5 z-[9999]"
            style={{ pointerEvents: 'none' }}
        >
            <div className="flex flex-col gap-4 pointer-events-auto items-center">
                <SOSButton />
            </div>
        </div>
    );
};

export default VerticalFab;
