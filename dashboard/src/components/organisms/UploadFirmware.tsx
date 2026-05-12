"use client";

import { useState, useContext, useEffect } from "react";
import { Card, Title, Stack, TextInput, Group, Button, FileButton, Text, Autocomplete, ActionIcon } from "@mantine/core";
import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { HiArrowUpTray, HiOutlineDocument } from "react-icons/hi2";

export default function UploadFirmware({ onUploaded }: { onUploaded: () => void }) {
  const { moduleRepository } = useContext(RepositoriesContext);
  const [loading, setLoading] = useState(false);
  const [program, setProgram] = useState("");
  const [version, setVersion] = useState("");
  const [target, setTarget] = useState("");
  const [channel, setChannel] = useState("stable");
  const [file, setFile] = useState<File | null>(null);

  // For autocomplete suggestions
  const [existingPrograms, setExistingPrograms] = useState<string[]>([]);
  const [existingTargets, setExistingTargets] = useState<string[]>([]);

  useEffect(() => {
    if (!moduleRepository) return;
    moduleRepository.getAllFirmware().then(fw => {
      const programs = Array.from(new Set(fw.map(f => f.program)));
      const targets = Array.from(new Set(fw.map(f => f.target)));
      setExistingPrograms(programs);
      setExistingTargets(targets);
    });
  }, [moduleRepository]);

  // Logic for revision + 1
  useEffect(() => {
    if (!moduleRepository || !program) return;
    
    moduleRepository.getAllFirmware(program).then(fw => {
      if (fw.length > 0) {
        const latest = fw[0].version;
        const parts = latest.split(".");
        if (parts.length === 3) {
          const patch = parseInt(parts[2]);
          if (!isNaN(patch)) {
            parts[2] = (patch + 1).toString();
            setVersion(parts.join("."));
          }
        }
      } else {
        setVersion("0.0.1");
      }
    });
  }, [moduleRepository, program]);

  const handleUpload = async () => {
    if (!moduleRepository || !file || !program || !version || !target) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("Program", program);
      formData.append("Version", version);
      formData.append("Target", target);
      formData.append("Channel", channel);
      formData.append("payload", file);

      await moduleRepository.uploadFirmware(formData);
      
      // Reset
      setFile(null);
      onUploaded();
    } catch (err) {
      console.error("Failed to upload firmware", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card p="xl" radius={32} shadow="sm" mt="xl">
      <Title order={3} size="h4" fw={500} mb="lg">
        Upload New Firmware
      </Title>

      <Stack gap="md">
        <Group grow align="flex-end">
          <Autocomplete 
            label="Program" 
            placeholder="e.g. autobar-dispenser" 
            data={existingPrograms}
            value={program}
            onChange={setProgram}
            radius="md"
          />
          <Autocomplete 
            label="Target" 
            placeholder="e.g. esp32-s3" 
            data={existingTargets}
            value={target}
            onChange={setTarget}
            radius="md"
          />
          <TextInput 
            label="Channel" 
            placeholder="stable/beta" 
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            radius="md"
          />
        </Group>

        <Group grow align="flex-end">
          <TextInput 
            label="Version" 
            placeholder="e.g. 0.0.21" 
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            radius="md"
          />
          <Stack gap={4}>
            <Text size="sm" fw={500}>Firmware File</Text>
            <FileButton onChange={setFile}>
              {(props) => (
                <Button 
                  {...props} 
                  variant="outline" 
                  radius="md" 
                  fullWidth
                  leftSection={<HiOutlineDocument />}
                  color={file ? "green" : "blue"}
                >
                  {file ? file.name : "Select File"}
                </Button>
              )}
            </FileButton>
          </Stack>
        </Group>

        <Group justify="flex-end" mt="sm">
          <Button 
            onClick={handleUpload} 
            loading={loading} 
            leftSection={<HiArrowUpTray size={16} />}
            radius="xl"
            disabled={!program || !version || !target || !file}
          >
            Upload Firmware
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
