import React, { useState } from 'react';
import { Button, Typography, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import Layout from './Layout';

const Settings = () => {
    const [isDeactivated, setIsDeactivated] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleDeactivateAccount = () => {
        setShowConfirmation(true);
    };

    const confirmDeactivation = () => {
        setIsDeactivated(true);
        setShowConfirmation(false);
    };

    const cancelDeactivation = () => {
        setShowConfirmation(false);
    };

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <Typography variant="h4" className="mb-4">My Settings</Typography>
                {isDeactivated ? (
                    <Typography variant="body1" color="red">
                        Your account has been deactivated.
                    </Typography>
                ) : (
                    <div>
                        <Typography variant="body1" className="mb-4">
                            You can deactivate your account here. Once deactivated, you will not be able to access your account.
                        </Typography>
                        <Button color="red" variant="filled" onClick={handleDeactivateAccount}>
                            Deactivate Account
                        </Button>
                    </div>
                )}
                
                {/* Confirmation Modal */}
                <Dialog open={showConfirmation} handler={setShowConfirmation}>
                    <DialogHeader>Confirm Deactivation</DialogHeader>
                    <DialogBody divider>
                        Are you sure you want to deactivate your account? This action cannot be undone.
                    </DialogBody>
                    <DialogFooter>
                        <Button color="red" variant="filled" onClick={confirmDeactivation}>
                            Yes, Deactivate
                        </Button>
                        <Button variant="outlined" color="blue" onClick={cancelDeactivation} className="ml-4">
                            Cancel
                        </Button>
                    </DialogFooter>
                </Dialog>
            </div>
        </Layout>
    );
};

export default Settings;
