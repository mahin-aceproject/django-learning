import { useMutation } from '@tanstack/react-query';
import { CreateUsers } from '@/scripts/query/users'
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { UsersSchema } from '@/scripts/formschema/users';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Divider, Modal, ModalClose, ModalDialog, DialogContent, DialogActions, Button, Typography as T } from "@mui/joy";
import { faker } from '@faker-js/faker';
import ManagedInput from '@/components/forms/ManagedInput';
import ManagedSwitch from '@/components/forms/ManagedSwitch';

export default function Page() {
    const nav = useNavigate();
    const users = useMutation(CreateUsers());
    const { control, handleSubmit, formState } = useForm({
        mode: "onBlur",
        shouldFocusError: true,
        resolver: yupResolver(UsersSchema)
    })

    function PerformCreate(data) {
        users.mutate(data);
        nav("/users");
    }

    return (
        <Modal open={true} onClose={()=>nav("/users")}>
            <ModalDialog component="form" onSubmit={handleSubmit(PerformCreate)} color="primary" variant="outlined" sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}>
                <DialogContent>
                    <ModalClose />
                    <T level="title-lg">Add User</T>
                    <Divider />
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'start', gap: 1}}>
                        <ManagedInput type="email" name="email" defaultValue={faker.internet.email} control={control} label="Email" />
                        <ManagedInput type="password" name="password" defaultValue="" control={control} label="Password" />
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'start', gap: 1}}>
                        <ManagedInput type="text" name="first_name" defaultValue="" control={control} label="First Name" />
                        <ManagedInput type="text" name="last_name" defaultValue="" control={control} label="Last Name" />
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'start', justifyContent: 'space-evenly', gap: 1}}>
                        <ManagedSwitch name="is_active" defaultValue={false} control={control} label="Activate User" />
                        <ManagedSwitch name="is_staff" defaultValue={false} control={control} label="Is Admin" />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" color="success" disabled={!formState.isValid || formState.isSubmitting}>Add User</Button>
                    <Button color="neutral" onClick={()=>nav("/users")}>Cancel</Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
    );
}