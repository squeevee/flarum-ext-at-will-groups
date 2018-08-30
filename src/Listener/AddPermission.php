<?php

// 'At-Will Groups' source code
// (c) 2018 Ellie Hawk "@squeevee"

namespace Squeevee\AtWillGroups\Listener;

use Flarum\Core\Group;
use Flarum\Event\GetPermission;
use Flarum\Settings\SettingsRepositoryInterface;

use Illuminate\Events\Dispatcher;

class AddPermission
{
    private $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function subscribe(Dispatcher $events)
    {
        $events->listen(GetPermission::class, [$this, 'getPermission']);
    }

    public function getPermission(GetPermission $event)
    {
        if($event->ability == 'squeevee.join_atWillGroup')
            return $this->getPermission_internal($event, true);
        if($event->ability == 'squeevee.leave_atWillGroup')
            return $this->getPermission_internal($event, false);
    }

    private function getPermission_internal(GetPermission $event, $join)
    {
        $group = $event->model;
        $actor = $event->actor;

        if ($group->id == Group::MEMBER_ID || $group->id == Group::GUEST_ID)
        return false;

        $groupSetting = $this->settings->get('atWillGroup_' . $group->id);

        if ($join)
        {
            return (($groupSetting == 'join-and-leave' || $groupSetting == 'join-only' || $actor->isAdmin())
                && $group->id != Group::ADMINISTRATOR_ID);
        }
        else
        {
            return (($groupSetting == 'join-and-leave' || $groupSetting =='leave-only' || $actor->isAdmin())
                && $group->id != Group::ADMINISTRATOR_ID);
        }
    }
}
