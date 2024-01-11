import React from 'react';
import { AlertOctagon } from 'lucide-react';
import { Button } from './button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTrigger,
} from './alert-dialog';
import { AlertDialogTitle } from '@radix-ui/react-alert-dialog';

export const ExtensionToggle = () => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost">
                    <AlertOctagon className="h-[1.2rem] w-[1.2rem]" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Deaktivér BedsteLectio</AlertDialogTitle>
                    <AlertDialogDescription>
                        Er du sikker på, at du vil deaktivere BedsteLectio i denne browser? Du kan altid aktivere
                        BedsteLectio igen ved at klikke knappen i Lectios meny-bar i toppen.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Afbryd</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            localStorage.setItem('bedstelectio-disabled', 'value');
                            document.location.reload();
                        }}
                    >
                        Deaktivér
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
