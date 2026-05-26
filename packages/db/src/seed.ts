import { PrismaClient } from "@prisma/client";
import { samplePolicies } from "@govfind/shared";

const prisma = new PrismaClient();

async function main() {
  for (const policy of samplePolicies) {
    await prisma.policy.upsert({
      where: {
        sourceSystem_sourceExternalId: {
          sourceSystem: policy.sourceSystem,
          sourceExternalId: policy.slug
        }
      },
      create: {
        ...policy,
        sourceExternalId: policy.slug,
        applyStartAt: policy.applyStartAt ? new Date(policy.applyStartAt) : null,
        applyEndAt: policy.applyEndAt ? new Date(policy.applyEndAt) : null,
        lastCheckedAt: policy.lastCheckedAt ? new Date(policy.lastCheckedAt) : null,
        faqJson: { items: policy.faq },
        rawJson: policy
      },
      update: {
        title: policy.title,
        summary: policy.summary,
        category: policy.category,
        agencyName: policy.agencyName,
        regions: policy.regions,
        applyType: policy.applyType,
        applyStatus: policy.applyStatus,
        supportSummary: policy.supportSummary,
        eligibilitySummary: policy.eligibilitySummary,
        contentSummary: policy.contentSummary,
        applyMethodSummary: policy.applyMethodSummary,
        requiredDocs: policy.requiredDocs,
        faqJson: { items: policy.faq },
        rawJson: policy,
        lastSyncedAt: new Date()
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
