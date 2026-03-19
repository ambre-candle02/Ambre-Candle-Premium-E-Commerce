'use client';
import SiteDesigner from '@/src/components/admin/SiteDesigner';
import { motion } from 'framer-motion';

export default function SiteDesignerPage() {
    return (
        <div className="admin-page-container">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <SiteDesigner />
            </motion.div>
            
            <style jsx>{`
                .admin-page-container {
                    padding: 20px;
                    min-height: 100vh;
                    background: transparent;
                }
            `}</style>
        </div>
    );
}
