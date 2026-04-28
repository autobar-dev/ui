"use client";

import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { Card, Title, TextInput, Flex, Text } from "@tremor/react";
import { useState, useContext } from "react";
import { HiTag, HiIdentification, HiHashtag, HiCalculator } from "react-icons/hi2";

export default function AddCurrency() {
  const { currencyRepository } = useContext(RepositoriesContext);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [minorUnitDivisor, setMinorUnitDivisor] = useState<string>("100");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Placeholder for actual request
      console.log("Creating currency:", { code, name, symbol, minorUnitDivisor: parseInt(minorUnitDivisor) });
      
      // Reset form
      setCode("");
      setName("");
      setSymbol("");
      setMinorUnitDivisor("100");
      alert(`Currency ${code} added successfully! (Logic placeholder)`);
    } catch (error) {
      console.error("Failed to create currency", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="rounded-2xl shadow-sm border-none bg-white p-8">
      <Flex justifyContent="start" alignItems="center" className="mb-8">
        <Title className="text-xl font-bold text-slate-800">Add New Currency</Title>
      </Flex>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <Text className="mb-2 ml-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Currency Code</Text>
            <TextInput
              icon={HiTag}
              placeholder="e.g. USD"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
              className="rounded-xl border-slate-200"
              maxLength={3}
            />
          </div>

          <div>
            <Text className="mb-2 ml-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</Text>
            <TextInput
              icon={HiIdentification}
              placeholder="e.g. US Dollar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-xl border-slate-200"
            />
          </div>

          <div>
            <Text className="mb-2 ml-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Symbol</Text>
            <TextInput
              icon={HiHashtag}
              placeholder="e.g. $"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="rounded-xl border-slate-200"
              maxLength={5}
            />
          </div>

          <div>
            <Text className="mb-2 ml-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Minor Unit Divisor</Text>
            <TextInput
              icon={HiCalculator}
              type="number"
              placeholder="e.g. 100"
              value={minorUnitDivisor}
              onChange={(e) => setMinorUnitDivisor(e.target.value)}
              required
              className="rounded-xl border-slate-200"
              min="1"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-50">
          <button
            type="submit"
            disabled={isLoading}
            className="px-12 py-3 rounded-[20px] text-base font-bold bg-[#3B82F6] hover:bg-[#2563EB] text-white transition-all active:scale-95 cursor-pointer border-none shadow-md hover:shadow-blue-200 flex justify-center items-center"
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </Card>
  );
}
