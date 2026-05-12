"use client";

import { Badge, Card, Title, Text, Group, Stack, Loader, Center, Avatar, Button, Modal, TextInput, ActionIcon, Table, Switch } from "@mantine/core";
import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { useContext, useEffect, useState } from "react";
import { Product } from "@/types/product";
import { serviceProductToProduct } from "@/utils/product_utils";
import { HiOutlinePencilSquare, HiOutlineTrash, HiPlus } from "react-icons/hi2";

export default function ProductDetailSection({ id }: { id: number }) {
  const { productRepository } = useContext(RepositoriesContext);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [namesModalOpen, setNamesModalOpen] = useState(false);
  const [badgesModalOpen, setBadgesModalOpen] = useState(false);
  const [descriptionsModalOpen, setDescriptionsModalOpen] = useState(false);
  const [confirmStatusModalOpen, setConfirmStatusModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<boolean | null>(null);

  // Edit states
  const [editNames, setEditNames] = useState<Record<string, string>>({});
  const [editBadges, setEditBadges] = useState<any[]>([]);
  const [editDescriptions, setEditDescriptions] = useState<Record<string, string>>({});
  
  // New entry states
  const [newNameLang, setNewNameLang] = useState("");
  const [newDescLang, setNewDescLang] = useState("");

  const loadProduct = () => {
    if (!productRepository) return;
    setLoading(true);
    productRepository.get(id)
      .then(resp => {
        if (resp.product) {
          const p = serviceProductToProduct(resp.product);
          setProduct(p);
          
          // Sync edit states (filter out weird 'id' field if present)
          const namesObj: Record<string, string> = {};
          p.names.forEach((v, k) => {
            if (k !== 'id') namesObj[k] = v;
          });
          setEditNames(namesObj);
          
          setEditBadges([...p.badges]);
          
          const descObj: Record<string, string> = {};
          p.descriptions.forEach((v, k) => {
            if (k !== 'id') descObj[k] = v;
          });
          setEditDescriptions(descObj);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load product", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProduct();
  }, [productRepository, id]);

  const handleUpdateStatus = async () => {
    if (!productRepository || !product || pendingStatus === null) return;
    try {
      await productRepository.updateStatus(id, pendingStatus);
      setProduct({ ...product, enabled: pendingStatus });
      setConfirmStatusModalOpen(false);
      setPendingStatus(null);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const onStatusChange = (enabled: boolean) => {
    setPendingStatus(enabled);
    setConfirmStatusModalOpen(true);
  };

  const handleSaveNames = async () => {
    if (!productRepository) return;
    try {
      await productRepository.updateNames(id, editNames);
      setNamesModalOpen(false);
      loadProduct();
    } catch (err) {
      console.error("Failed to save names", err);
    }
  };

  const handleSaveBadges = async () => {
    if (!productRepository) return;
    try {
      await productRepository.updateBadges(id, editBadges);
      setBadgesModalOpen(false);
      loadProduct();
    } catch (err) {
      console.error("Failed to save badges", err);
    }
  };

  const handleSaveDescriptions = async () => {
    if (!productRepository) return;
    try {
      await productRepository.updateDescriptions(id, editDescriptions);
      setDescriptionsModalOpen(false);
      loadProduct();
    } catch (err) {
      console.error("Failed to save descriptions", err);
    }
  };

  if (loading || !product) {
    return (
      <Center h={400}>
        <Loader size="lg" variant="dots" />
      </Center>
    );
  }

  const nameEn = product.names.get("en") || Array.from(product.names.values())[0] || "Unknown";

  return (
    <Stack gap="xl">
      {/* Header Card */}
      <Card p="xl" radius={32} shadow="sm">
        <Group justify="space-between" align="flex-start">
          <Group gap="xl">
            <Avatar src={product.cover?.url} size={120} radius={24} />
            <Stack gap={4}>
              <Title order={2} fw={500}>{nameEn}</Title>
              <Text size="sm" c="dimmed" ff="monospace">{product.slug}</Text>
              <Group gap={8} mt="xs">
                {product.badges.map((badge, i) => (
                  <Badge key={i} variant="light" color="blue" size="sm" radius="sm">{badge}</Badge>
                ))}
                <ActionIcon variant="subtle" size="sm" onClick={() => setBadgesModalOpen(true)}>
                  <HiOutlinePencilSquare />
                </ActionIcon>
              </Group>
            </Stack>
          </Group>
          <Stack align="flex-end" gap="xs">
            <Switch 
              label="Product Enabled" 
              checked={product.enabled} 
              onChange={(e) => onStatusChange(e.currentTarget.checked)}
              color="green"
              size="md"
            />
          </Stack>
        </Group>
      </Card>

      <Group grow align="flex-start">
        {/* Names Card */}
        <Card p="xl" radius={32} shadow="sm">
          <Group justify="space-between" mb="lg">
            <Title order={3} size="h4" fw={500}>Localized Names</Title>
            <Button variant="light" size="xs" radius="xl" onClick={() => setNamesModalOpen(true)} leftSection={<HiOutlinePencilSquare />}>
              Edit
            </Button>
          </Group>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Language</Table.Th>
                <Table.Th>Name</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {Array.from(product.names.entries()).filter(([k]) => k !== 'id').map(([lang, val]) => (
                <Table.Tr key={lang}>
                  <Table.Td><Badge variant="outline" color="gray">{lang}</Badge></Table.Td>
                  <Table.Td><Text size="sm">{val}</Text></Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>

        {/* Descriptions Card */}
        <Card p="xl" radius={32} shadow="sm">
          <Group justify="space-between" mb="lg">
            <Title order={3} size="h4" fw={500}>Localized Descriptions</Title>
            <Button variant="light" size="xs" radius="xl" onClick={() => setDescriptionsModalOpen(true)} leftSection={<HiOutlinePencilSquare />}>
              Edit
            </Button>
          </Group>
          <Table verticalSpacing="sm">
            <Table.Tbody>
              {Array.from(product.descriptions.entries()).filter(([k]) => k !== 'id').map(([lang, val]) => (
                <Table.Tr key={lang}>
                  <Table.Td w={100}><Badge variant="outline" color="gray">{lang}</Badge></Table.Td>
                  <Table.Td><Text size="sm">{val}</Text></Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </Group>

      {/* Confirmation Modal for Status */}
      <Modal opened={confirmStatusModalOpen} onClose={() => setConfirmStatusModalOpen(false)} title="Confirm Status Change" radius={24}>
        <Stack gap="md">
          <Text size="sm">
            Are you sure you want to {pendingStatus ? "enable" : "disable"} this product? 
            {pendingStatus ? "" : " It will no longer be visible to users."}
          </Text>
          <Group justify="flex-end">
            <Button variant="subtle" radius="xl" onClick={() => setConfirmStatusModalOpen(false)}>Cancel</Button>
            <Button color={pendingStatus ? "green" : "red"} radius="xl" onClick={handleUpdateStatus}>
              Confirm {pendingStatus ? "Enable" : "Disable"}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Modals */}
      <Modal opened={namesModalOpen} onClose={() => setNamesModalOpen(false)} title="Edit Localized Names" radius={24} p="xl">
        <Stack gap="md">
          {Object.entries(editNames).map(([lang, val]) => (
            <Group key={lang} grow align="flex-end">
              <TextInput label="Language" value={lang} readOnly radius="md" />
              <TextInput label="Name" value={val} onChange={(e) => setEditNames({...editNames, [lang]: e.target.value})} radius="md" />
              <ActionIcon color="red" variant="subtle" onClick={() => {
                const next = {...editNames};
                delete next[lang];
                setEditNames(next);
              }}>
                <HiOutlineTrash />
              </ActionIcon>
            </Group>
          ))}
          
          <Card p="md" radius="lg" withBorder bg="gray.0">
            <Text size="xs" fw={500} mb={8} c="dimmed">ADD NEW TRANSLATION</Text>
            <Group align="flex-end">
              <TextInput 
                placeholder="Code (e.g. fr)" 
                style={{ width: 100 }} 
                value={newNameLang} 
                onChange={(e) => setNewNameLang(e.target.value)}
                radius="md"
              />
              <Button 
                variant="light" 
                size="sm" 
                radius="xl" 
                onClick={() => {
                  if (newNameLang) {
                    setEditNames({...editNames, [newNameLang]: ""});
                    setNewNameLang("");
                  }
                }}
                disabled={!newNameLang}
              >
                Add
              </Button>
            </Group>
          </Card>

          <Button onClick={handleSaveNames} radius="xl" mt="md">Save Names</Button>
        </Stack>
      </Modal>

      <Modal opened={badgesModalOpen} onClose={() => setBadgesModalOpen(false)} title="Edit Badges" radius={24} p="xl">
        <Stack gap="md">
          {editBadges.map((badge, i) => (
            <Group key={i} grow>
              <TextInput value={badge} onChange={(e) => {
                const next = [...editBadges];
                next[i] = e.target.value;
                setEditBadges(next);
              }} radius="md" />
              <ActionIcon color="red" variant="subtle" onClick={() => setEditBadges(editBadges.filter((_, idx) => idx !== i))}>
                <HiOutlineTrash />
              </ActionIcon>
            </Group>
          ))}
          <Button variant="subtle" size="xs" leftSection={<HiPlus />} onClick={() => setEditBadges([...editBadges, ""])}>
            Add Badge
          </Button>
          <Button onClick={handleSaveBadges} radius="xl" mt="md">Save Badges</Button>
        </Stack>
      </Modal>

      <Modal opened={descriptionsModalOpen} onClose={() => setDescriptionsModalOpen(false)} title="Edit Localized Descriptions" radius={24} p="xl">
        <Stack gap="md">
          {Object.entries(editDescriptions).map(([lang, val]) => (
            <Group key={lang} grow align="flex-end">
              <TextInput label="Language" value={lang} readOnly radius="md" />
              <TextInput label="Description" value={val} onChange={(e) => setEditDescriptions({...editDescriptions, [lang]: e.target.value})} radius="md" />
              <ActionIcon color="red" variant="subtle" onClick={() => {
                const next = {...editDescriptions};
                delete next[lang];
                setEditDescriptions(next);
              }}>
                <HiOutlineTrash />
              </ActionIcon>
            </Group>
          ))}

          <Card p="md" radius="lg" withBorder bg="gray.0">
            <Text size="xs" fw={500} mb={8} c="dimmed">ADD NEW TRANSLATION</Text>
            <Group align="flex-end">
              <TextInput 
                placeholder="Code (e.g. fr)" 
                style={{ width: 100 }} 
                value={newDescLang} 
                onChange={(e) => setNewDescLang(e.target.value)}
                radius="md"
              />
              <Button 
                variant="light" 
                size="sm" 
                radius="xl" 
                onClick={() => {
                  if (newDescLang) {
                    setEditDescriptions({...editDescriptions, [newDescLang]: ""});
                    setNewDescLang("");
                  }
                }}
                disabled={!newDescLang}
              >
                Add
              </Button>
            </Group>
          </Card>

          <Button onClick={handleSaveDescriptions} radius="xl" mt="md">Save Descriptions</Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
