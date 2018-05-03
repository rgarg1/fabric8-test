import { browser, element, by, ExpectedConditions as until, $, $$ } from 'protractor';
import { FeatureLevelUtils } from '../support/feature_level';
import { MainDashboardPage } from '../page_objects/main_dashboard.page';
import { PageOpenMode } from '../page_objects/base.page';
import * as support from '../support';
import { SpaceDashboardPage } from '../..';
import { BuildStatus } from '../support/build_status';
import { ReleaseStrategy } from '../support/release_strategy';

export abstract class AccountHomeInteractionsFactory {

    public static create(): AccountHomeInteractions {

        if (FeatureLevelUtils.isInternal()) {
            return <AccountHomeInteractions>{
                openAccountHome(mode: PageOpenMode): void {},
            };
        }

        if (FeatureLevelUtils.isBeta()) {
            return new BetaAccountHomeInteractions();
        }

        return new ReleasedAccountHomeInteractions();
    }
}

export interface AccountHomeInteractions {

    openAccountHome(mode: PageOpenMode): void;

    createSpace(name: string): void;

    resetEnvironment(): void;

    openSpaceDashboard(name: string): void;
}

export abstract class AbstractSpaceDashboardInteractions implements AccountHomeInteractions {

    public async abstract openAccountHome(mode: PageOpenMode): Promise<void>;

    public async abstract createSpace(name: string): Promise<void>;

    public async abstract resetEnvironment(): Promise<void>;

    public async abstract openSpaceDashboard(name: string): Promise<void>;
}

export class ReleasedAccountHomeInteractions extends AbstractSpaceDashboardInteractions {

    protected dashboardPage: MainDashboardPage;

    constructor() {
        super();
        this.dashboardPage = new MainDashboardPage();
    }

    public async openAccountHome(mode: PageOpenMode): Promise<void> {
        await this.dashboardPage.open(mode);
    }

    public async createSpace(name: string): Promise<void> {
        await this.dashboardPage.createNewSpace(name);
    }

    public async resetEnvironment(): Promise<void> {
        let dashboardPage = new MainDashboardPage();
        let userProfilePage = await dashboardPage.gotoUserProfile();
        let editProfilePage = await userProfilePage.gotoEditProfile();
        let cleanupEnvPage = await editProfilePage.gotoResetEnvironment();
        await cleanupEnvPage.cleanup(browser.params.login.user);
    }

    public async openSpaceDashboard(name: string): Promise<void> {
        await this.dashboardPage.openSpace(name);
    }
}

export class BetaAccountHomeInteractions extends ReleasedAccountHomeInteractions {

    public async createSpace(name: string): Promise<void> {
        await this.dashboardPage.createNewSpaceByLauncher(name);
    }
}