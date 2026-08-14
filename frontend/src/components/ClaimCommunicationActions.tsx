import {
  AssignmentIndOutlined,
  AttachFileOutlined,
  DownloadOutlined,
  ForumOutlined,
  NoteAltOutlined,
  PriorityHighOutlined,
  SendOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface ClaimNote {
  id: number;
  author: string;
  role: string;
  time: string;
  text: string;
  visibility: "Internal" | "Provider" | "Member";
}

const initialNotes: ClaimNote[] = [
  {
    id: 1,
    author: "Dr. Nora Al-Salem",
    role: "Clinical Reviewer",
    time: "21 Jul 2026 · 09:08",
    text: "Clinical documentation supports emergency appendectomy. Pathology report remains outstanding.",
    visibility: "Internal",
  },
  {
    id: 2,
    author: "MediVantage Workflow Engine",
    role: "Automated System",
    time: "21 Jul 2026 · 09:12",
    text: "Claim routed to the medical director because final human authorization is required.",
    visibility: "Internal",
  },
  {
    id: 3,
    author: "Claims Operations",
    role: "Provider Relations",
    time: "21 Jul 2026 · 09:16",
    text: "Document request prepared for the provider: pathology report and assistant surgeon justification.",
    visibility: "Provider",
  },
];

function getVisibilityColor(
  visibility: ClaimNote["visibility"],
): "default" | "primary" | "success" {
  if (visibility === "Provider") return "primary";
  if (visibility === "Member") return "success";
  return "default";
}

export default function ClaimCommunicationActions() {
  const [notes, setNotes] = useState<ClaimNote[]>(initialNotes);
  const [noteText, setNoteText] = useState("");
  const [visibility, setVisibility] =
    useState<ClaimNote["visibility"]>("Internal");
  const [workflowMessage, setWorkflowMessage] = useState(
    "Awaiting medical director approval",
  );

  const addNote = () => {
    const trimmedNote = noteText.trim();

    if (!trimmedNote) return;

    setNotes((currentNotes) => [
      ...currentNotes,
      {
        id: Date.now(),
        author: "Dr. Samuel Israel",
        role: "Claims Decision Reviewer",
        time: "Just now",
        text: trimmedNote,
        visibility,
      },
    ]);

    setNoteText("");
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          xl: "minmax(0, 1.35fr) minmax(320px, 0.65fr)",
        },
        gap: 3,
        mt: 3,
        alignItems: "start",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1.25,
          }}
        >
          <ForumOutlined color="primary" />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Notes & Communication Center
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Internal collaboration and controlled stakeholder communication
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ p: 2.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
            Add Communication
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mb: 1.5,
            }}
          >
            {(["Internal", "Provider", "Member"] as const).map((option) => (
              <Chip
                key={option}
                label={option}
                clickable
                color={visibility === option ? "primary" : "default"}
                variant={visibility === option ? "filled" : "outlined"}
                onClick={() => setVisibility(option)}
                sx={{ fontWeight: 700 }}
              />
            ))}
          </Box>

          <TextField
            fullWidth
            multiline
            minRows={4}
            value={noteText}
            onChange={(event) => setNoteText(event.target.value)}
            placeholder={`Write a ${visibility.toLowerCase()} note or message...`}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1.5,
              mt: 1.5,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<AttachFileOutlined />}
              sx={{ fontWeight: 700 }}
            >
              Attach Document
            </Button>

            <Button
              variant="contained"
              startIcon={<SendOutlined />}
              onClick={addNote}
              disabled={!noteText.trim()}
              sx={{ fontWeight: 800 }}
            >
              Add Communication
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
            Communication History
          </Typography>

          <Box sx={{ display: "grid", gap: 1.5 }}>
            {notes.map((note) => (
              <Box
                key={note.id}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      {note.author}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {note.role} · {note.time}
                    </Typography>
                  </Box>

                  <Chip
                    label={note.visibility}
                    size="small"
                    color={getVisibilityColor(note.visibility)}
                    variant="outlined"
                    sx={{ fontWeight: 700 }}
                  />
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.7,
                  }}
                >
                  {note.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1.25,
          }}
        >
          <NoteAltOutlined color="primary" />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Claim Actions
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Workflow, escalation and document controls
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ p: 2.5 }}>
          <Box
            sx={{
              border: "1px solid",
              borderColor: "warning.light",
              bgcolor: "warning.50",
              borderRadius: 2,
              p: 2,
              mb: 2.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 700,
              }}
            >
              Current Workflow Status
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{
                mt: 0.5,
                fontWeight: 900,
              }}
            >
              {workflowMessage}
            </Typography>

            <Chip
              label="Human Oversight Required"
              color="warning"
              size="small"
              sx={{ mt: 1.25, fontWeight: 800 }}
            />
          </Box>

          <Box sx={{ display: "grid", gap: 1.25 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AttachFileOutlined />}
              onClick={() =>
                setWorkflowMessage(
                  "Supporting-document request sent to provider",
                )
              }
              sx={{
                justifyContent: "flex-start",
                fontWeight: 800,
                py: 1.2,
              }}
            >
              Request Documents
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<AssignmentIndOutlined />}
              onClick={() =>
                setWorkflowMessage("Claim assigned to senior medical reviewer")
              }
              sx={{
                justifyContent: "flex-start",
                fontWeight: 800,
                py: 1.2,
              }}
            >
              Assign Reviewer
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="warning"
              startIcon={<PriorityHighOutlined />}
              onClick={() =>
                setWorkflowMessage(
                  "Claim escalated to medical director for urgent review",
                )
              }
              sx={{
                justifyContent: "flex-start",
                fontWeight: 800,
                py: 1.2,
              }}
            >
              Escalate Claim
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<DownloadOutlined />}
              onClick={() =>
                setWorkflowMessage("Claim summary prepared for export")
              }
              sx={{
                justifyContent: "flex-start",
                fontWeight: 800,
                py: 1.2,
              }}
            >
              Export Claim Summary
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5 }}>
            Communication Controls
          </Typography>

          <Box sx={{ display: "grid", gap: 1.25 }}>
            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Provider Communication
              </Typography>

              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                Document request pending
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Member Notification
              </Typography>

              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                Not yet required
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Assigned Reviewer
              </Typography>

              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                Dr. Nora Al-Salem
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Escalation Level
              </Typography>

              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                Level 1 — Medical Director
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}