# Next.js Program Management Application - Technical Documentation

A modern web application built with Next.js 15 for managing educational programs and students. This documentation explains the code architecture, data flow, and implementation details.

## 📋 Prerequisites

- **Node.js**: Version 20.x or higher
- **npm**: Version 10.x or higher
- **Backend API**: Running on `http://localhost:3001`

## 🛠️ Installation

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd my-app
npm install
```

Create `.env` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🚀 Running the Application

```bash
npm run dev  # Development mode
npm run build && npm start  # Production mode
```

Access at [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Application Architecture

### Directory Structure

```
my-app/
├── app/
│   ├── api/
│   │   └── programs/
│   │       ├── route.js              # POST & GET endpoints
│   │       └── [programId]/
│   │           └── route.js          # PUT endpoint
│   ├── programs/
│   │   └── page.jsx                  # Main program management page
│   ├── students/
│   │   └── page.jsx                  # Student management page
│   ├── layout.jsx                    # Root layout with sidebar
│   └── page.jsx                      # Home page
└── components/
    ├── ui/                           # shadcn/ui components
    └── Sidebar.jsx                   # Navigation sidebar
```

---

## 📡 API Routes (Backend Proxy Layer)

### 1. `/app/api/programs/route.js`

This file acts as a **proxy layer** between the Next.js frontend and the external backend API.

#### **POST /api/programs** - Create Program

```javascript
export async function POST(request) {
    try {
        // Parse incoming request body from frontend
        const body = await request.json();

        // Forward request to backend API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        // Return backend response to frontend
        const data = await response.json();
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
```

**Flow:**
1. Frontend sends program data (programcode, description)
2. Route.js receives and validates the request
3. Forwards to backend at `http://localhost:3001/programs`
4. Backend processes and stores in database
5. Response flows back: Backend → Route.js → Frontend

---

#### **GET /api/programs** - Fetch All Programs

```javascript
export async function GET() {
    try {
        // Fetch all programs from backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs/All`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        // Return programs array to frontend
        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
```

**Flow:**
1. Frontend component calls `fetch('/api/programs')`
2. Route.js forwards to `http://localhost:3001/programs/All`
3. Backend returns array of program objects
4. Route.js passes data to frontend
5. Frontend renders programs in table/cards

---

### 2. `/app/api/programs/[programId]/route.js`

Dynamic route for updating specific programs by ID.

#### **PUT /api/programs/:programId** - Update Program

```javascript
export async function PUT(request, { params }) {
    try {
        // Extract programId from URL parameters
        const { programId } = params;
        
        // Parse update data from request body
        const body = await request.json();

        // Forward update request to backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs/${programId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        // Return updated program data
        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
```

**Flow:**
1. User clicks "Edit" on a program card
2. Frontend sends PUT request with programId and updated data
3. Route.js extracts programId from URL (`/api/programs/123`)
4. Forwards to backend: `http://localhost:3001/programs/123`
5. Backend updates database record
6. Updated program returns to frontend

---

## 🎯 Program Management Page (`/app/programs/page.jsx`)

This is the main application file containing all program management logic.

### Component Hierarchy

```
ProgramsPage (Parent Component)
├── CreateProgramFormDialog (Modal)
│   └── CreateProgramForm (Form UI)
├── Search Input
└── ProgramsTable (Data Display)
    └── ProgramCard[] (Individual Cards)
```

---

## 🔄 Complete CRUD Flow

### **1. READ (Fetch Programs) - Application Load**

#### **Entry Point: `ProgramsPage` Component**

```javascript
export default function ProgramsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [Program, setProgram] = useState(null);
  const [refetchPrograms, setRefetchPrograms] = useState(() => () => {});

  // Handlers
  const handleRowClick = (program) => { /* Opens edit modal */ };
  const handleProgramCreated = async (createdProgramCode) => { /* Refetch & search */ };

  return (
    <div className="p-8">
      <CreateProgramFormDialog {...props} />
      <Button onClick={() => openCreateModal()}>Create New Program</Button>
      <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      <ProgramsTable searchQuery={searchQuery} onRowClick={handleRowClick} />
    </div>
  );
}
```

**State Management:**
- `isCreateModalOpen`: Controls modal visibility
- `searchQuery`: Filters displayed programs
- `Program`: Holds currently selected program for editing (null = create mode)
- `refetchPrograms`: Callback function to reload data after mutations

---

#### **Step 1: `ProgramsTable` Component Renders**

```javascript
function ProgramsTable({ searchQuery, onRowClick, setRefetchCallback }) {
  const { programs, loading, error, refetch } = useFetchPrograms();
  const [filterCategory, setFilterCategory] = useState("All");
  const [codeFilter, setCodeFilter] = useState("All");

  // Register refetch function with parent
  useEffect(() => {
    if (refetch) {
      setRefetchCallback(() => refetch);
    }
  }, []);

  // Filter logic
  const searchFilteredData = programs.filter((program) =>
    program.v_programcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.v_description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Status & Code dropdowns */}
      <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
        <option value="All">All Status</option>
        {/* Dynamic options from programs data */}
      </select>

      {/* Program cards */}
      <div className="space-y-4">
        {searchFilteredData.map((program) => (
          <ProgramCard key={program.v_programid} Program={program} onRowClick={onRowClick} />
        ))}
      </div>
    </div>
  );
}
```

**Flow:**
1. Component mounts and calls `useFetchPrograms()`
2. Registers `refetch` function with parent via callback
3. Displays loading state while fetching
4. Renders program cards when data arrives
5. Applies real-time search filtering

---

#### **Step 2: `useFetchPrograms` Hook - Data Fetching**

```javascript
function useFetchPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      // Call Next.js API route (not backend directly)
      const response = await fetch("/api/programs");
      
      if (!response.ok) {
        throw new Error("Failed to fetch programs");
      }
      
      const data = await response.json();
      setPrograms(data);  // Store in state
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on component mount
  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  return { programs, loading, error, refetch: fetchPrograms };
}
```

**Key Points:**
- Uses `useCallback` to memoize `fetchPrograms` function (prevents infinite loops)
- Returns `refetch` function for manual data refresh
- Handles loading/error states
- Updates state triggers re-render of `ProgramsTable`

**Complete Flow:**
```
User opens /programs page
    ↓
ProgramsPage renders
    ↓
ProgramsTable renders
    ↓
useFetchPrograms() executes
    ↓
fetch('/api/programs') → route.js → backend
    ↓
Backend returns array of programs
    ↓
setPrograms(data) updates state
    ↓
ProgramsTable re-renders with data
    ↓
Maps over programs array
    ↓
Renders ProgramCard for each program
```

---

#### **Step 3: `ProgramCard` Component - Display**

```javascript
function ProgramCard({ Program, onRowClick }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{Program.v_programcode}</CardTitle>
        <CardDescription>
          ID: {Program.v_programid} | Status: {Program.v_isactive ? "Active" : "Inactive"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{Program.v_description || "No description available"}</p>
        <p className="text-xs">
          Created: {new Date(Program.v_createdat).toLocaleString("en-PH")}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onRowClick(Program)}>Edit Program</Button>
      </CardFooter>
    </Card>
  );
}
```

**Functionality:**
- Displays program details in card format
- Formats dates to Philippine timezone
- Edit button triggers `onRowClick(Program)` → Opens edit modal

---

### **2. CREATE (Add New Program)**

#### **Step 1: User Clicks "Create New Program"**

```javascript
// In ProgramsPage component
<Button onClick={() => {
  setProgram(null);  // Clear any selected program
  setIsCreateModalOpen(true);  // Open modal
}}>
  <Plus className="mr-2 h-4 w-4" />
  Create New Program
</Button>
```

---

#### **Step 2: `CreateProgramFormDialog` Component**

```javascript
function CreateProgramFormDialog({ isModalOpen, setIsModalOpen, Program, onProgramCreated }) {
  // Separate hooks for create and update
  const { createProgram, loading: createLoading, message: createMessage } = useCreateProgram(
    (programCode) => onProgramCreated(programCode)
  );

  const { updateProgram, loading: updateLoading, message: updateMessage } = useUpdateProgram(
    (programCode) => onProgramCreated(programCode),
    Program?.v_programid
  );

  // Conditionally select handler based on mode
  const handleSubmit = Program ? updateProgram : createProgram;
  const loading = Program ? updateLoading : createLoading;
  const message = Program ? updateMessage : createMessage;

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {Program ? "Edit Program" : "Create New Program"}
          </DialogTitle>
        </DialogHeader>
        <CreateProgramForm
          onSubmit={handleSubmit}
          loading={loading}
          message={message}
          Program={Program}
          onCancel={() => setIsModalOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
```

**Key Logic:**
- When `Program` is null → Create mode
- When `Program` has data → Edit mode
- Uses conditional hooks to determine which operation

---

#### **Step 3: `CreateProgramForm` Component**

```javascript
function CreateProgramForm({ onSubmit, loading, message, onCancel, Program }) {
  // Controlled form state
  const [programcode, setProgramcode] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Populate form when editing
  useEffect(() => {
    if (Program) {
      setProgramcode(Program.v_programcode || "");
      setDescription(Program.v_description || "");
      setIsActive(Program.v_isactive ?? true);
    } else {
      // Reset form for create mode
      setProgramcode("");
      setDescription("");
      setIsActive(true);
    }
  }, [Program]);

  const isFormValid = programcode.trim() !== "" && description.trim() !== "";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* Program Code Input */}
      <div>
        <Label htmlFor="programcode">Program Code</Label>
        <Input
          id="programcode"
          name="programcode"
          value={programcode}
          onChange={(e) => setProgramcode(e.target.value)}
          required
        />
      </div>

      {/* Description Input */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      {/* Status Dropdown - Only shown in edit mode */}
      {Program && (
        <div>
          <Label htmlFor="isActive">Status</Label>
          <select
            id="isActive"
            name="isActive"
            value={String(isActive)}
            onChange={(e) => setIsActive(e.target.value === "true")}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" disabled={loading || !isFormValid}>
        {loading ? 
          (Program ? "Updating..." : "Creating...") : 
          (Program ? "Update Program" : "Create Program")
        }
      </Button>

      {/* Cancel Button */}
      <Button type="button" onClick={onCancel}>Cancel</Button>

      {/* Success/Error Message */}
      {message && <p>{message}</p>}
    </form>
  );
}
```

**Form Features:**
- **Controlled inputs** using state
- **Dynamic behavior** based on create/edit mode
- **Status field** only visible when editing
- **Validation** disables submit if fields empty
- **Loading states** prevent double submission

---

#### **Step 4: `useCreateProgram` Hook - Submit Logic**

```javascript
function useCreateProgram(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const createProgram = async (e) => {
    e.preventDefault();  // Prevent page reload
    setLoading(true);
    setMessage("");

    // Extract form data
    const formData = new FormData(e.target);
    
    try {
      // Send to Next.js API route
      const response = await fetch("/api/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programcode: formData.get("programcode"),
          description: formData.get("description"),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Program created successfully!");
        
        // Call success callback (triggers refetch & search)
        onSuccess?.(formData.get("programcode"));
      } else {
        setMessage("Failed to create program.");
      }
    } catch (error) {
      setMessage("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return { createProgram, loading, message };
}
```

**Complete CREATE Flow:**
```
User clicks "Create New Program"
    ↓
Modal opens (Program = null)
    ↓
User fills form fields
    ↓
User clicks "Create Program"
    ↓
useCreateProgram() executes
    ↓
fetch('/api/programs', POST) → route.js → backend
    ↓
Backend creates record in database
    ↓
Response: { v_programid: 123, v_programcode: "BSCS", ... }
    ↓
onSuccess(programcode) callback fires
    ↓
handleProgramCreated() in parent component
    ↓
1. refetchPrograms() - Reload data
    ↓
2. setSearchQuery(programcode) - Auto-search new program
    ↓
3. setIsCreateModalOpen(false) - Close modal
    ↓
Table updates with new program visible
```

---

### **3. UPDATE (Edit Existing Program)**

#### **Step 1: User Clicks "Edit Program" on Card**

```javascript
// In ProgramCard component
<Button onClick={() => onRowClick(Program)}>Edit Program</Button>

// In ProgramsPage component
const handleRowClick = (program) => {
  setProgram(program);  // Store selected program
  setIsCreateModalOpen(true);  // Open modal
};
```

---

#### **Step 2: Form Loads with Program Data**

```javascript
// In CreateProgramForm useEffect
useEffect(() => {
  if (Program) {
    setProgramcode(Program.v_programcode || "");
    setDescription(Program.v_description || "");
    setIsActive(Program.v_isactive ?? true);
  }
}, [Program]);
```

**Form now shows:**
- Pre-filled program code (editable)
- Pre-filled description (editable)
- Status dropdown (visible only in edit mode)

---

#### **Step 3: `useUpdateProgram` Hook - Update Logic**

```javascript
function useUpdateProgram(onSuccess, programId) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const updateProgram = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.target);
    
    try {
      // PUT request to dynamic route with programId
      const response = await fetch(`/api/programs/${programId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programcode: formData.get("programcode"),
          description: formData.get("description"),
          isActive: formData.get("isActive") === "true",  // Include status
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Program updated successfully!");
        onSuccess?.(formData.get("programcode"));
      } else {
        setMessage("Failed to update program.");
      }
    } catch (error) {
      setMessage("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateProgram, loading, message };
}
```

**Complete UPDATE Flow:**
```
User clicks "Edit Program" on card
    ↓
handleRowClick(program) fires
    ↓
setProgram(program) - Store program data
    ↓
Modal opens with Program data
    ↓
Form fields populate via useEffect
    ↓
User modifies description or status
    ↓
User clicks "Update Program"
    ↓
useUpdateProgram() executes
    ↓
fetch(`/api/programs/${programId}`, PUT) → route.js
    ↓
route.js extracts programId from URL
    ↓
Forwards to backend: PUT /programs/123
    ↓
Backend updates database record
    ↓
Returns updated program object
    ↓
onSuccess(programcode) callback
    ↓
handleProgramCreated() in parent
    ↓
1. refetchPrograms() - Reload all data
    ↓
2. setSearchQuery(programcode) - Search updated program
    ↓
3. setIsCreateModalOpen(false) - Close modal
    ↓
Table refreshes with updated data
    ↓
Updated program card shows new values
```

---

### **4. DELETE (Not Implemented Yet)**

Current status: Delete functionality is planned but not implemented.

**Future implementation would follow this pattern:**

```javascript
function useDeleteProgram(onSuccess) {
  const deleteProgram = async (programId) => {
    const response = await fetch(`/api/programs/${programId}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      onSuccess();
    }
  };
  return { deleteProgram };
}

// Add to backend route.js
export async function DELETE(request, { params }) {
  const { programId } = params;
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs/${programId}`, {
    method: 'DELETE'
  });
  return NextResponse.json({ success: true });
}
```

---

## 🔍 Search & Filter System

### Real-time Search Implementation

```javascript
// In ProgramsPage
const [searchQuery, setSearchQuery] = useState("");

<Input
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Search programs..."
/>

// In ProgramsTable
const searchFilteredData = programs.filter((program) =>
  program.v_programcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
  program.v_description.toLowerCase().includes(searchQuery.toLowerCase())
);
```

**How it works:**
1. User types in search box
2. `setSearchQuery` updates state
3. Component re-renders with new searchQuery
4. `ProgramsTable` receives updated searchQuery prop
5. Filter function runs on every render
6. Only matching programs displayed

### Filter Dropdowns

```javascript
// Status filter
const [filterCategory, setFilterCategory] = useState("All");

const filteredByStatus = filterCategory === "All"
  ? searchFilteredData
  : searchFilteredData.filter(p => String(p.v_isactive) === filterCategory);

// Code filter
const [codeFilter, setCodeFilter] = useState("All");

const finalFiltered = codeFilter === "All"
  ? filteredByStatus
  : filteredByStatus.filter(p => p.v_programcode === codeFilter);
```

**Filter Chain:**
```
All Programs
    ↓
Search Filter (by code or description)
    ↓
Status Filter (Active/Inactive)
    ↓
Code Filter (specific program code)
    ↓
Final Displayed Programs
```

---

## 🔄 Data Refetch System

### Why Refetch is Needed

After CREATE or UPDATE operations, the displayed data becomes stale. The refetch system ensures the UI shows the latest database state.

### Implementation

```javascript
// Parent component stores refetch callback
const [refetchPrograms, setRefetchPrograms] = useState(() => () => {});

// Child component registers its refetch function
useEffect(() => {
  if (refetch) {
    setRefetchCallback(() => refetch);
  }
}, []);

// After mutation, trigger refetch
const handleProgramCreated = async (createdProgramCode) => {
  await refetchPrograms();  // Wait for data reload
  setSearchQuery(createdProgramCode);  // Then search for new/updated program
  setIsCreateModalOpen(false);
};
```

**Flow Diagram:**
```
useFetchPrograms creates refetch function
    ↓
ProgramsTable registers refetch with parent
    ↓
Parent stores in refetchPrograms state
    ↓
User creates/updates program
    ↓
handleProgramCreated calls refetchPrograms()
    ↓
refetch() in useFetchPrograms executes
    ↓
New fetch('/api/programs') request
    ↓
Updated data from backend
    ↓
setPrograms(newData) updates state
    ↓
All components re-render with fresh data
```

---

## 🎨 UI Component Library

This application uses **shadcn/ui** components:

### Core Components Used

1. **Dialog**: Modal for create/edit forms
2. **Card**: Program display cards
3. **Button**: All interactive buttons
4. **Input**: Text input fields
5. **Label**: Form field labels
6. **Select**: Status dropdown (custom implementation)

### Component Import Pattern

```javascript
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
```

All UI components are located in `/components/ui/` and built with Radix UI primitives.

---

## 📱 Responsive Design

### Sidebar Navigation

```javascript
// In app/layout.jsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <main className="ml-0 md:ml-64 transition-all duration-300">
          {children}
        </main>
      </body>
    </html>
  );
}
```

**Features:**
- Mobile: Hamburger menu with overlay
- Desktop: Fixed sidebar with 256px width
- Smooth transitions between breakpoints

---

## 🔒 Type Safety

Although using JavaScript, the application maintains type safety through:

### JSDoc Comments

```javascript
/**
 * @typedef {Object} Program
 * @property {number} v_programid
 * @property {string} v_programcode
 * @property {string} v_description
 * @property {boolean} v_isactive
 * @property {string} v_createdat
 * @property {string|null} v_modifiedat
 */

/**
 * @param {Program} Program
 * @param {(program: Program) => void} onRowClick
 */
function ProgramCard({ Program, onRowClick }) {
  // ...
}
```

---

## 🐛 Error Handling

### API Error Handling

```javascript
try {
  const response = await fetch('/api/programs');
  if (!response.ok) {
    throw new Error('Failed to fetch programs');
  }
  const data = await response.json();
  setPrograms(data);
} catch (err) {
  setError(err.message);  // Display to user
  console.error('Fetch error:', err);
}
```

### Form Validation

```javascript
const isFormValid = programcode.trim() !== "" && description.trim() !== "";

<Button type="submit" disabled={loading || !isFormValid}>
  Create Program
</Button>
```

---

## 🚀 Performance Optimizations

### 1. useCallback for Memoization

```javascript
const fetchPrograms = useCallback(async () => {
  // Fetch logic
}, []); // Empty deps = function never recreated
```

### 2. Conditional Rendering

```javascript
{loading && <p>Loading...</p>}
{error && <p>Error: {error}</p>}
{!loading && !error && programs.map(...)}
```

### 3. Debounced Search (Future Enhancement)

```javascript
import { useDebounce } from 'use-debounce';

const [debouncedSearch] = useDebounce(searchQuery, 300);
```

---

## 🗺️ Future Enhancements

- [ ] DELETE program functionality
- [ ] Pagination for large datasets
- [ ] Advanced filtering (date ranges, sorting)
- [ ] Bulk operations (select multiple programs)
- [ ] Export to CSV/Excel
- [ ] Program deletion with confirmation modal
- [ ] Audit log (track who created/modified programs)

---

## 📞 Support

For questions about the codebase, create an issue in the repository.

---

Made with ❤️ using Next.js 15 + shadcn/ui
