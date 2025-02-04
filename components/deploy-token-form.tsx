import { useState } from "react";
import { useDeployToken } from "@/hooks/use-deploy-token";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function DeployTokenForm() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState("");

  const { deployToken, isPending, isSuccess, error, deployedTokenAddress } =
    useDeployToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await deployToken({ name, symbol, initialSupply });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deploy New Token</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Token Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="symbol">Token Symbol</Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="initialSupply">Initial Supply</Label>
            <Input
              id="initialSupply"
              type="number"
              value={initialSupply}
              onChange={(e) => setInitialSupply(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Deploying..." : "Deploy Token"}
          </Button>
        </form>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {isSuccess && deployedTokenAddress && (
          <Alert className="mt-4">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Token deployed at address: {deployedTokenAddress}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
