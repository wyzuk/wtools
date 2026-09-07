import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { TOOLS, getToolBySlug } from "@/lib/tools-data";
import { ToolLayout } from "@/components/ToolLayout";

// Network
import { IpLookupTool } from "@/components/tools/network/IpLookupTool";
import { DnsLookupTool } from "@/components/tools/network/DnsLookupTool";
import { AsnLookupTool } from "@/components/tools/network/AsnLookupTool";
import { ReverseDnsTool } from "@/components/tools/network/ReverseDnsTool";
import { SubnetCalcTool } from "@/components/tools/network/SubnetCalcTool";
import { HttpHeadersTool } from "@/components/tools/network/HttpHeadersTool";
import { IpReputationTool } from "@/components/tools/network/IpReputationTool";
import { MyIpTool } from "@/components/tools/network/MyIpTool";

// Domain
import { WhoisTool } from "@/components/tools/domain/WhoisTool";
import { DnsRecordsTool } from "@/components/tools/domain/DnsRecordsTool";
import { MxLookupTool } from "@/components/tools/domain/MxLookupTool";
import { SpfDmarcTool } from "@/components/tools/domain/SpfDmarcTool";
import { SslInspectorTool } from "@/components/tools/domain/SslInspectorTool";

// Web
import { UrlAnalyzerTool } from "@/components/tools/web/UrlAnalyzerTool";
import { HttpStatusTool } from "@/components/tools/web/HttpStatusTool";
import { MetadataInspectorTool } from "@/components/tools/web/MetadataInspectorTool";
import { RobotsCheckerTool } from "@/components/tools/web/RobotsCheckerTool";

// Security
import { HashGeneratorTool } from "@/components/tools/security/HashGeneratorTool";
import { HashIdentifierTool } from "@/components/tools/security/HashIdentifierTool";
import { JwtDecoderTool } from "@/components/tools/security/JwtDecoderTool";
import { Base64CodecTool } from "@/components/tools/security/Base64CodecTool";
import { SecurityHeadersTool } from "@/components/tools/security/SecurityHeadersTool";
import { PasswordGeneratorTool } from "@/components/tools/security/PasswordGeneratorTool";

// Phone
import { PhoneValidatorTool } from "@/components/tools/phone/PhoneValidatorTool";
import { PhoneFormatterTool } from "@/components/tools/phone/PhoneFormatterTool";
import { CountryCallingCodesTool } from "@/components/tools/phone/CountryCallingCodesTool";

// Geo
import { IpGeoTool } from "@/components/tools/geo/IpGeoTool";
import { CoordinateConverterTool } from "@/components/tools/geo/CoordinateConverterTool";
import { CountryInfoTool } from "@/components/tools/geo/CountryInfoTool";

// Developer
import { JsonFormatterTool } from "@/components/tools/developer/JsonFormatterTool";
import { JsonDiffTool } from "@/components/tools/developer/JsonDiffTool";
import { UuidGeneratorTool } from "@/components/tools/developer/UuidGeneratorTool";
import { RegexTesterTool } from "@/components/tools/developer/RegexTesterTool";
import { UnixTimestampTool } from "@/components/tools/developer/UnixTimestampTool";
import { UserAgentParserTool } from "@/components/tools/developer/UserAgentParserTool";
import { MimeTypesTool } from "@/components/tools/developer/MimeTypesTool";
import { HttpStatusCodesTool } from "@/components/tools/developer/HttpStatusCodesTool";

interface ToolPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);
  if (!tool) {
    return {
      title: "Tool Not Found — WTOOLS",
    };
  }

  return {
    title: `${tool.name} — WTOOLS`,
    description: tool.longDescription,
    keywords: tool.keywords,
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = getToolBySlug(params.slug);
  if (!tool) {
    notFound();
  }

  const renderToolComponent = () => {
    switch (tool.slug) {
      // Network
      case "ip-lookup":
        return <IpLookupTool />;
      case "dns-lookup":
        return <DnsLookupTool />;
      case "asn-lookup":
        return <AsnLookupTool />;
      case "reverse-dns":
        return <ReverseDnsTool />;
      case "subnet-calculator":
        return <SubnetCalcTool />;
      case "http-headers":
        return <HttpHeadersTool />;
      case "ip-reputation":
        return <IpReputationTool />;
      case "my-ip":
        return <MyIpTool />;

      // Domain
      case "whois":
        return <WhoisTool />;
      case "dns-records":
        return <DnsRecordsTool />;
      case "mx-lookup":
        return <MxLookupTool />;
      case "spf-dmarc-checker":
        return <SpfDmarcTool />;
      case "ssl-inspector":
        return <SslInspectorTool />;

      // Web
      case "url-analyzer":
        return <UrlAnalyzerTool />;
      case "http-status-checker":
        return <HttpStatusTool />;
      case "metadata-inspector":
        return <MetadataInspectorTool />;
      case "robots-checker":
        return <RobotsCheckerTool />;

      // Security
      case "hash-generator":
        return <HashGeneratorTool />;
      case "hash-identifier":
        return <HashIdentifierTool />;
      case "jwt-decoder":
        return <JwtDecoderTool />;
      case "base64-codec":
        return <Base64CodecTool />;
      case "security-headers":
        return <SecurityHeadersTool />;
      case "password-generator":
        return <PasswordGeneratorTool />;

      // Phone
      case "phone-lookup":
      case "phone-validator":
        return <PhoneValidatorTool />;
      case "phone-formatter":
        return <PhoneFormatterTool />;
      case "country-calling-codes":
        return <CountryCallingCodesTool />;

      // Geo
      case "ip-geo":
        return <IpGeoTool />;
      case "coordinate-converter":
        return <CoordinateConverterTool />;
      case "country-info":
        return <CountryInfoTool />;

      // Developer
      case "json-formatter":
        return <JsonFormatterTool />;
      case "json-diff":
        return <JsonDiffTool />;
      case "uuid-generator":
        return <UuidGeneratorTool />;
      case "regex-tester":
        return <RegexTesterTool />;
      case "unix-timestamp":
        return <UnixTimestampTool />;
      case "user-agent-parser":
        return <UserAgentParserTool />;
      case "mime-types":
        return <MimeTypesTool />;
      case "http-status-codes":
        return <HttpStatusCodesTool />;

      default:
        return (
          <div className="p-6 text-center text-xs font-mono text-white/50 bg-black border border-white/10 rounded">
            Tool under active development.
          </div>
        );
    }
  };

  return <ToolLayout tool={tool}>{renderToolComponent()}</ToolLayout>;
}
