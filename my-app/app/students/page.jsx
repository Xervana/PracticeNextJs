'use client';
import {Field, FieldLabel} from "@/components/ui/field";
import { useState } from "react";
import { useEffect } from "react";
export default function StudentsPage() {
    const { programs, loading: programsLoading } = useFetchPrograms();
    const { createStudent, loading: createLoading, message: createMessage } = useCreateStudent();
    return (
        <div>
            <h1>Students Page</h1>
            <p>This is the students page content.</p>
            <CreateStudentForm onSubmit={createStudent} loading={createLoading} message={createMessage} programs={programs} programsLoading={programsLoading} />
        </div>
    );
}

function CreateStudentForm({onSubmit, loading, message, programs, programsLoading}) {
    return (
        <form onSubmit={onSubmit}>
            <Field>
                <FieldLabel>Last Name</FieldLabel>
                <input type="text" name="lastName" placeholder="Last Name" />
            </Field>
            <Field>
                <FieldLabel>First Name</FieldLabel>
                <input type="text" name="firstName" placeholder="First Name" />
            </Field>
            <Field>
                <FieldLabel>Email</FieldLabel>
                <input type="text" name="email" placeholder="Email" />
            </Field>
            <Field>
                <FieldLabel>Year Level</FieldLabel>
                <input type="text" name="yearLevel" placeholder="Year Level" />
            </Field>
            <Field>
                <FieldLabel>Program</FieldLabel>
                <select name="program" disabled={programsLoading}>
                    <option value="">Select a program</option>
                    {programs.map((program) => (
                        <option key={program.v_programcode} value={program.v_programid}>
                            {program.v_programcode}
                        </option>
                    ))}
                </select>
            </Field>
            <Field>
                <FieldLabel>Gender</FieldLabel>
                <input type="text" name="gender" placeholder="Gender" />
            </Field>
            <Field>
                <FieldLabel>Date of Birth</FieldLabel>
                <input type="date" name="dateOfBirth" placeholder="Date of Birth" />
            </Field>



            <button type="submit" disabled={loading}>Create Student</button>
            {message && <p>{message}</p>}
        </form>
    );
}

function useCreateStudent(onSuccess){
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const createStudent = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage("");
        
        const formData = new FormData(event.target);
        try{
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lastname: formData.get('lastName'),
                    firstname: formData.get('firstName'),
                    email: formData.get('email'),
                    yearlevel: formData.get('yearLevel'),
                    programid: formData.get('program'),
                    gender: formData.get('gender'),
                    dateofbirth: formData.get('dateOfBirth'),
                }),
            });
            if (response.ok){
                const data = await response.json();
                setMessage(`Student created successfully! ID: ${data.id}`);
                event.target.reset();
                onSuccess?.();
            } else {
                const errorData = await response.json();
                setMessage(`Error: ${errorData.error || 'Failed to create student'}`);
            }
        } catch (error){
            setMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    return {createStudent, loading, message};
}

function useFetchPrograms(){
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const fetchProgams = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/programs');
            if (response.ok) {
                const data = await response.json();
                setPrograms(data);
            }
        } catch (error) {
            console.error('Error fetching programs:', error);
        } finally {
            setLoading(false);  
        }
    };
    useEffect(() => {
        fetchProgams();
    }, []);

    return {programs, loading, refetch: fetchProgams};
}